import { ContactStatus } from '@prisma/client';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';

export interface ContactView {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  source: string | null;
  respondedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user: Pick<PublicUser, 'id' | 'email' | 'name' | 'role' | 'avatarUrl'> | null;
}

export interface ContactDeleteResult {
  deleted: boolean;
}
