import { SkillCategory } from '@prisma/client';

export interface SkillView {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number;
  icon: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillCategoryOption {
  value: SkillCategory;
  label: string;
}

export interface SkillDeleteResult {
  deleted: boolean;
}
