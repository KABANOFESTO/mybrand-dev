import { PaymentProvider, PaymentStatus } from '@prisma/client';

export interface PaymentView {
  id: string;
  provider: PaymentProvider;
  transactionRef: string;
  planName: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  metadata: Record<string, unknown> | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
}

export interface PaymentCheckoutItem {
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutSessionResult {
  payment: PaymentView;
  sessionId: string;
  paymentLink: string;
  amount: number;
  kind: string;
  createdAt: string;
}

export interface CashinResult {
  payment: PaymentView;
  ref: string;
  amount: number;
  kind: string;
  status: string;
  createdAt: string;
}

export interface PaymentSummaryView {
  totalPayments: number;
  pendingPayments: number;
  successfulPayments: number;
  failedPayments: number;
  refundedPayments: number;
  cancelledPayments: number;
  totalRevenue: string;
  currency: string;
  recentPayments: PaymentView[];
}

export interface PaymentWebhookResult {
  verified: boolean;
  processed: boolean;
  payment: PaymentView | null;
  eventKind: string | null;
  status: string | null;
}

export interface PaypackAuthResponse {
  access: string;
  refresh: string;
  expires: number | string;
}

export interface PaypackCheckoutResponse {
  session_id: string;
  amount: number;
  kind: string;
  payment_link: string;
  created_at: string;
}

export interface PaypackTransactionResponse {
  amount: number;
  created_at: string;
  kind: string;
  ref: string;
  status: string;
}

export interface PaypackWebhookPayload {
  event_kind?: string;
  kind?: string;
  status?: string;
  session_id?: string;
  ref?: string;
  data?: {
    ref?: string;
    kind?: string;
    fee?: number;
    merchant?: string;
    client?: string;
    amount?: number;
    provider?: string;
    status?: string;
    created_at?: string;
    processed_at?: string;
    session_id?: string;
  };
}
