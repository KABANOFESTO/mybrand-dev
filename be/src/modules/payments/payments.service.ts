import { Injectable, BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PaymentProvider, PaymentStatus } from '@prisma/client';
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { PrismaService } from '@database/prisma/prisma.service';
import { NotificationsService } from '@modules/notifications/notifications.service';
import { AnalyticsService } from '@modules/analytics/analytics.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { CreateCashinDto } from './dto/create-cashin.dto';
import { ListPaymentsQueryDto } from './dto/list-payments-query.dto';
import type {
  CashinResult,
  CheckoutSessionResult,
  PaymentCheckoutItem,
  PaymentSummaryView,
  PaymentView,
  PaymentWebhookResult,
  PaypackAuthResponse,
  PaypackCheckoutResponse,
  PaypackTransactionResponse,
  PaypackWebhookPayload,
} from './interfaces/payment.interfaces';
import { NotificationType } from '@prisma/client';

const PAYMENT_SELECT = {
  id: true,
  provider: true,
  transactionRef: true,
  planName: true,
  amount: true,
  currency: true,
  status: true,
  metadata: true,
  paidAt: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
} as const satisfies Prisma.PaymentSelect;

type PaymentEntity = Prisma.PaymentGetPayload<{ select: typeof PAYMENT_SELECT }>;

interface PaypackTokenCache {
  access: string;
  refresh: string;
  expiresAt: Date;
}

@Injectable()
export class PaymentsService {
  private tokenCache: PaypackTokenCache | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  async createCheckoutSession(
    userId: string,
    email: string,
    dto: CreateCheckoutDto,
  ): Promise<CheckoutSessionResult> {
    const appId = this.getRequiredConfig('payment.appId', 'PAYPACK_APP_ID');
    const items = this.normalizeCheckoutItems(dto.items);
    const checkoutResponse = await this.requestCheckoutSession({
      appId,
      email,
      items,
    });

    const amount = this.calculateCheckoutAmount(items);
    const payment = await this.prisma.payment.create({
      data: {
        provider: PaymentProvider.PAYPACK,
        transactionRef: checkoutResponse.session_id,
        planName: this.normalizePlanName(dto.label || items[0]?.name || 'PayPack checkout'),
        amount: new Prisma.Decimal(amount),
        currency: this.getCurrency(),
        status: PaymentStatus.PENDING,
        metadata: this.toJson({
          type: 'checkout',
          email,
          items,
          paypack: checkoutResponse,
        }),
        userId,
      },
      select: PAYMENT_SELECT,
    });

    await this.analyticsService.trackEvent(
      {
        name: 'payment.checkout.created',
        path: '/payments/checkout',
        metadata: this.toJson({ paymentId: payment.id, sessionId: checkoutResponse.session_id, amount }),
      },
      { userId },
    );

    return {
      payment: this.toView(payment),
      sessionId: checkoutResponse.session_id,
      paymentLink: checkoutResponse.payment_link,
      amount: checkoutResponse.amount,
      kind: checkoutResponse.kind,
      createdAt: checkoutResponse.created_at,
    };
  }

  async createCashin(userId: string, dto: CreateCashinDto): Promise<CashinResult> {
    const accessToken = await this.getPaypackAccessToken();
    const response = await this.requestJson<PaypackTransactionResponse>({
      url: `${this.getBaseUrl().replace(/\/$/, '')}/transactions/cashin`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Idempotency-Key': this.createIdempotencyKey(),
        'X-Webhook-Mode': this.getWebhookMode(),
      },
      body: {
        amount: dto.amount,
        number: dto.number,
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        provider: PaymentProvider.PAYPACK,
        transactionRef: response.ref,
        planName: this.normalizePlanName(dto.label || 'PayPack cashin'),
        amount: new Prisma.Decimal(response.amount),
        currency: this.getCurrency(),
        status: this.mapPaypackStatus(response.status),
        metadata: this.toJson({
          type: 'cashin',
          phoneNumber: dto.number,
          paypack: response,
        }),
        paidAt: this.isSuccessfulStatus(response.status) ? new Date(response.created_at) : null,
        userId,
      },
      select: PAYMENT_SELECT,
    });

    await Promise.all([
      this.analyticsService.trackEvent(
        {
          name: 'payment.cashin.created',
          path: '/payments/cashin',
          metadata: this.toJson({ paymentId: payment.id, ref: response.ref, amount: response.amount }),
        },
        { userId },
      ),
      this.notificationsService.sendUserNotification(userId, {
        type: NotificationType.PAYMENT,
        title: 'Payment request created',
        body: 'Your PayPack payment request is pending confirmation.',
        metadata: this.toJson({ paymentId: payment.id, ref: response.ref, kind: response.kind }),
      }),
    ]);

    return {
      payment: this.toView(payment),
      ref: response.ref,
      amount: response.amount,
      kind: response.kind,
      status: response.status,
      createdAt: response.created_at,
    };
  }

  async listMyPayments(userId: string, query?: ListPaymentsQueryDto): Promise<PaymentView[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        userId,
        ...(query?.pendingOnly ? { status: PaymentStatus.PENDING } : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
      select: PAYMENT_SELECT,
    });

    return payments.map((payment) => this.toView(payment));
  }

  async listAllPayments(query?: { pendingOnly?: boolean }): Promise<PaymentView[]> {
    const payments = await this.prisma.payment.findMany({
      where: query?.pendingOnly ? { status: PaymentStatus.PENDING } : undefined,
      orderBy: [{ createdAt: 'desc' }],
      select: PAYMENT_SELECT,
    });

    return payments.map((payment) => this.toView(payment));
  }

  async getMyPaymentById(userId: string, id: string): Promise<PaymentView> {
    const payment = await this.findPaymentOrThrow(id);
    if (payment.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this payment');
    }

    return this.toView(payment);
  }

  async getPaymentById(id: string): Promise<PaymentView> {
    const payment = await this.findPaymentOrThrow(id);
    return this.toView(payment);
  }

  async getSummary(): Promise<PaymentSummaryView> {
    const [totalPayments, pendingPayments, successfulPayments, failedPayments, refundedPayments, cancelledPayments, aggregate, recentPayments] = await Promise.all([
      this.prisma.payment.count(),
      this.prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.SUCCEEDED } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.FAILED } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.REFUNDED } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.CANCELLED } }),
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
      this.prisma.payment.findMany({
        orderBy: [{ createdAt: 'desc' }],
        take: 8,
        select: PAYMENT_SELECT,
      }),
    ]);

    return {
      totalPayments,
      pendingPayments,
      successfulPayments,
      failedPayments,
      refundedPayments,
      cancelledPayments,
      totalRevenue: aggregate._sum.amount ? aggregate._sum.amount.toString() : '0',
      currency: this.getCurrency(),
      recentPayments: recentPayments.map((payment) => this.toView(payment)),
    };
  }

  async handleWebhook(rawBody: Buffer, signature?: string): Promise<PaymentWebhookResult> {
    if (!signature) {
      throw new UnauthorizedException('Missing PayPack signature');
    }

    const secret = this.getRequiredConfig('payment.webhookSecret', 'PAYPACK_WEBHOOK_SECRET');
    const digest = createHmac('sha256', secret).update(rawBody).digest('base64');

    if (!this.safeEquals(digest, signature)) {
      throw new UnauthorizedException('Invalid PayPack signature');
    }

    const payload = JSON.parse(rawBody.toString('utf8')) as PaypackWebhookPayload;
    const eventKind = payload.event_kind ?? payload.kind ?? null;
    const transactionRef = payload.data?.ref ?? payload.ref ?? payload.data?.session_id ?? payload.session_id ?? null;
    const status = (payload.data?.status ?? payload.status ?? null)?.toString().toLowerCase() ?? null;

    if (!transactionRef) {
      return {
        verified: true,
        processed: false,
        payment: null,
        eventKind,
        status,
      };
    }

    const payment = await this.prisma.payment.findUnique({
      where: { transactionRef },
      select: PAYMENT_SELECT,
    });

    if (!payment) {
      return {
        verified: true,
        processed: false,
        payment: null,
        eventKind,
        status,
      };
    }

    const mappedStatus = this.mapWebhookStatus(status, eventKind);
    const paidAt = mappedStatus === PaymentStatus.SUCCEEDED ? new Date(payload.data?.processed_at ?? payload.data?.created_at ?? new Date()) : payment.paidAt;

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: mappedStatus,
        paidAt,
        metadata: this.mergeMetadata(payment.metadata, {
          webhook: payload,
          webhookEventKind: eventKind,
          webhookStatus: status,
        }),
      },
      select: PAYMENT_SELECT,
    });

    if (mappedStatus === PaymentStatus.SUCCEEDED && updated.userId) {
      await this.notificationsService.sendUserNotification(updated.userId, {
        type: NotificationType.PAYMENT,
        title: 'Payment successful',
        body: `Payment for ${updated.planName} has been confirmed.`,
        metadata: this.toJson({ paymentId: updated.id, transactionRef }),
      });
    }

    return {
      verified: true,
      processed: true,
      payment: this.toView(updated),
      eventKind,
      status,
    };
  }

  async getAdminPaymentContext() {
    const summary = await this.getSummary();
    return summary;
  }

  private async findPaymentOrThrow(id: string): Promise<PaymentEntity> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      select: PAYMENT_SELECT,
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  private async requestCheckoutSession(params: {
    appId: string;
    email: string;
    items: PaymentCheckoutItem[];
  }): Promise<PaypackCheckoutResponse> {
    return this.requestJson<PaypackCheckoutResponse>({
      url: `${this.getCheckoutBaseUrl().replace(/\/$/, '')}/checkouts/initiate`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        items: params.items,
        app_id: params.appId,
        email: params.email,
      },
    });
  }

  private async getPaypackAccessToken(): Promise<string> {
    if (this.tokenCache && this.tokenCache.expiresAt.getTime() > Date.now() + 30_000) {
      return this.tokenCache.access;
    }

    if (this.tokenCache?.refresh) {
      try {
        const refreshed = await this.requestJson<PaypackAuthResponse>({
          url: `${this.getBaseUrl().replace(/\/$/, '')}/auth/agents/refresh/${encodeURIComponent(this.tokenCache.refresh)}`,
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        this.tokenCache = this.buildTokenCache(refreshed);
        return this.tokenCache.access;
      } catch {
        this.tokenCache = null;
      }
    }

    const clientId = this.getRequiredConfig('payment.clientId', 'PAYPACK_CLIENT_ID');
    const clientSecret = this.getRequiredConfig('payment.clientSecret', 'PAYPACK_CLIENT_SECRET');
    const response = await this.requestJson<PaypackAuthResponse>({
      url: `${this.getBaseUrl().replace(/\/$/, '')}/auth/agents/authorize`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        client_id: clientId,
        client_secret: clientSecret,
      },
    });

    this.tokenCache = this.buildTokenCache(response);
    return this.tokenCache.access;
  }

  private buildTokenCache(response: PaypackAuthResponse): PaypackTokenCache {
    const expiresInMs = this.parseExpiryToMs(response.expires);
    return {
      access: response.access,
      refresh: response.refresh,
      expiresAt: new Date(Date.now() + expiresInMs),
    };
  }

  private parseExpiryToMs(value: number | string) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed > 1000 ? parsed : parsed * 1000;
    }

    return 15 * 60 * 1000;
  }

  private async requestJson<T>(params: {
    url: string;
    method: 'GET' | 'POST';
    headers: Record<string, string>;
    body?: unknown;
  }): Promise<T> {
    const timeoutMs = this.getTimeoutMs();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(params.url, {
        method: params.method,
        headers: params.headers,
        body: params.body === undefined ? undefined : JSON.stringify(params.body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const responseText = await response.text().catch(() => '');
        throw new InternalServerErrorException(
          `PayPack request failed with status ${response.status}${responseText ? `: ${responseText}` : ''}`,
        );
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  private normalizeCheckoutItems(items: CreateCheckoutDto['items']): PaymentCheckoutItem[] {
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('At least one checkout item is required');
    }

    return items.map((item) => ({
      name: this.normalizePlanName(item.name),
      price: item.price,
      quantity: item.quantity,
    }));
  }

  private calculateCheckoutAmount(items: PaymentCheckoutItem[]) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  private safeEquals(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    if (leftBuffer.length !== rightBuffer.length) {
      return false;
    }

    return timingSafeEqual(leftBuffer, rightBuffer);
  }

  private mapPaypackStatus(status: string): PaymentStatus {
    const normalized = status.trim().toLowerCase();
    if (normalized === 'successful' || normalized === 'success' || normalized === 'processed') {
      return PaymentStatus.SUCCEEDED;
    }
    if (normalized === 'failed' || normalized === 'error' || normalized === 'declined') {
      return PaymentStatus.FAILED;
    }
    if (normalized === 'cancelled' || normalized === 'canceled') {
      return PaymentStatus.CANCELLED;
    }
    return PaymentStatus.PENDING;
  }

  private mapWebhookStatus(status: string | null, eventKind: string | null): PaymentStatus {
    const normalized = (status || '').trim().toLowerCase();
    const event = (eventKind || '').trim().toLowerCase();

    if (normalized === 'successful' || event.includes('processed')) {
      return PaymentStatus.SUCCEEDED;
    }
    if (normalized === 'failed' || normalized === 'error') {
      return PaymentStatus.FAILED;
    }
    if (normalized === 'cancelled' || normalized === 'canceled') {
      return PaymentStatus.CANCELLED;
    }
    return PaymentStatus.PENDING;
  }

  private isSuccessfulStatus(status: string) {
    return this.mapPaypackStatus(status) === PaymentStatus.SUCCEEDED;
  }

  private mergeMetadata(existing: Prisma.JsonValue | null, extra: Record<string, unknown>): Prisma.InputJsonValue {
    const current = this.toPlainObject(existing);
    return this.toJson({ ...current, ...extra });
  }

  private toPlainObject(value: Prisma.JsonValue | null): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return value as Record<string, unknown>;
  }

  private toJson(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }

  private toView(payment: PaymentEntity): PaymentView {
    return {
      id: payment.id,
      provider: payment.provider,
      transactionRef: payment.transactionRef,
      planName: payment.planName,
      amount: payment.amount.toString(),
      currency: payment.currency,
      status: payment.status,
      metadata: this.toPlainObject(payment.metadata),
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      userId: payment.userId,
    };
  }

  private normalizePlanName(value: string) {
    const normalized = value.trim();
    if (!normalized) {
      throw new BadRequestException('Plan name is required');
    }

    return normalized;
  }

  private getBaseUrl() {
    return this.configService.get<string>('payment.baseUrl', 'https://payments.paypack.rw/api');
  }

  private getCheckoutBaseUrl() {
    return this.configService.get<string>('payment.checkoutBaseUrl', 'https://checkout.paypack.rw/api');
  }

  private getWebhookMode() {
    return this.configService.get<string>('payment.webhookMode', 'development');
  }

  private getCurrency() {
    return this.configService.get<string>('payment.currency', 'RWF');
  }

  private getTimeoutMs() {
    const seconds = this.configService.get<number>('payment.requestTimeoutSeconds', 30);
    return Math.max(5, seconds) * 1000;
  }

  private getRequiredConfig(key: string, envName: string) {
    const value = this.configService.get<string>(key, '').trim();
    if (!value) {
      throw new BadRequestException(`Missing required payment configuration: ${envName}`);
    }

    return value;
  }

  private createIdempotencyKey() {
    return randomBytes(16).toString('hex');
  }
}
