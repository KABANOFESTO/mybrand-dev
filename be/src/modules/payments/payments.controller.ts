import { Body, Controller, Get, Headers, Param, ParseUUIDPipe, Post, Query, RawBody, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from '@prisma/client';
import { buildApiResponse } from '@shared/helpers/api-response.helper';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { CreateCashinDto } from './dto/create-cashin.dto';
import { ListPaymentsQueryDto } from './dto/list-payments-query.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(
    @CurrentUser() user: PublicUser,
    @Body() dto: CreateCheckoutDto,
  ) {
    const session = await this.paymentsService.createCheckoutSession(user.id, user.email, dto);
    return buildApiResponse('Checkout session created successfully', session);
  }

  @Post('cashin')
  @UseGuards(JwtAuthGuard)
  async createCashin(
    @CurrentUser() user: PublicUser,
    @Body() dto: CreateCashinDto,
  ) {
    const result = await this.paymentsService.createCashin(user.id, dto);
    return buildApiResponse('Payment request created successfully', result);
  }

  @Post('webhook/paypack')
  async handlePaypackWebhook(
    @RawBody() rawBody: Buffer,
    @Headers('x-paypack-signature') signature?: string,
  ) {
    const result = await this.paymentsService.handleWebhook(rawBody, signature);
    return buildApiResponse('PayPack webhook processed successfully', result);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async listMyPayments(@CurrentUser() user: PublicUser, @Query() query: ListPaymentsQueryDto) {
    const payments = await this.paymentsService.listMyPayments(user.id, query);
    return buildApiResponse('Payments loaded successfully', payments);
  }

  @Get('me/:id')
  @UseGuards(JwtAuthGuard)
  async getMyPayment(
    @CurrentUser() user: PublicUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const payment = await this.paymentsService.getMyPaymentById(user.id, id);
    return buildApiResponse('Payment loaded successfully', payment);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async listAllPayments(@Query() query: ListPaymentsQueryDto) {
    const payments = await this.paymentsService.listAllPayments({
      pendingOnly: query.pendingOnly,
    });
    return buildApiResponse('Payments loaded successfully', payments);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getSummary() {
    const summary = await this.paymentsService.getSummary();
    return buildApiResponse('Payments summary loaded successfully', summary);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getPaymentById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const payment = await this.paymentsService.getPaymentById(id);
    return buildApiResponse('Payment loaded successfully', payment);
  }
}
