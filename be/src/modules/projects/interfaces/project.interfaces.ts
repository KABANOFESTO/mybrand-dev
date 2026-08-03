import { UserRole } from '@prisma/client';

export interface ProjectOwnerSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
}

export interface ProjectView {
  id: string;
  slug: string;
  title: string;
  description: string;
  repositoryUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  status: import('@prisma/client').ProjectStatus;
  technologies: string[];
  features: string[];
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  owner: ProjectOwnerSummary | null;
}

export interface ProjectDeleteResult {
  deleted: boolean;
}
