import { NotificationType } from '@prisma/client';

export interface NotificationView {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata: Record<string, unknown> | null;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
}

export interface NotificationDeleteResult {
  deleted: boolean;
}
