import { UserRole } from '@prisma/client';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';

export interface ProfileDetails {
  id: string;
  headline: string | null;
  bio: string | null;
  about: string | null;
  location: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  resumeUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileView {
  user: PublicUser;
  profile: ProfileDetails | null;
}

export interface ProfileSummary {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  headline: string | null;
  location: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  resumeUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
