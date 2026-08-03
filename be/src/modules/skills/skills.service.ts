import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, SkillCategory, UserRole } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import type { SkillCategoryOption, SkillDeleteResult, SkillView } from './interfaces/skill.interfaces';

const SKILL_SELECT = {
  id: true,
  name: true,
  category: true,
  proficiency: true,
  icon: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.SkillSelect;

type SkillEntity = Prisma.SkillGetPayload<{ select: typeof SKILL_SELECT }>;

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASE: 'Database',
  DEVOPS: 'DevOps',
  AI_ML: 'AI / ML',
  DESIGN: 'Design',
  OTHER: 'Other',
};

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async listSkills(): Promise<SkillView[]> {
    const skills = await this.prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
      select: SKILL_SELECT,
    });

    return skills.map((skill) => this.toSkillView(skill));
  }

  async listCategories(): Promise<SkillCategoryOption[]> {
    return Object.values(SkillCategory).map((value) => ({
      value,
      label: CATEGORY_LABELS[value],
    }));
  }

  async createSkill(actor: PublicUser, dto: CreateSkillDto): Promise<SkillView> {
    this.assertCanManage(actor);

    await this.ensureNameIsAvailable(dto.name);

    const skill = await this.prisma.skill.create({
      data: {
        name: this.normalizeText(dto.name),
        category: dto.category,
        proficiency: dto.proficiency,
        icon: this.normalizeText(dto.icon),
        sortOrder: dto.sortOrder ?? 0,
      },
      select: SKILL_SELECT,
    });

    return this.toSkillView(skill);
  }

  async updateSkill(
    actor: PublicUser,
    skillId: string,
    dto: UpdateSkillDto,
  ): Promise<SkillView> {
    this.assertCanManage(actor);

    const skill = await this.findSkillOrThrow(skillId);

    if (dto.name !== undefined && this.normalizeText(dto.name).toLowerCase() !== skill.name.toLowerCase()) {
      await this.ensureNameIsAvailable(dto.name, skillId);
    }

    const updated = await this.prisma.skill.update({
      where: { id: skillId },
      data: {
        ...(dto.name !== undefined ? { name: this.normalizeText(dto.name) } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.proficiency !== undefined ? { proficiency: dto.proficiency } : {}),
        ...(dto.icon !== undefined ? { icon: this.normalizeText(dto.icon) } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
      select: SKILL_SELECT,
    });

    return this.toSkillView(updated);
  }

  async deleteSkill(actor: PublicUser, skillId: string): Promise<SkillDeleteResult> {
    this.assertCanManage(actor);
    await this.findSkillOrThrow(skillId);

    await this.prisma.skill.delete({ where: { id: skillId } });
    return { deleted: true };
  }

  private async findSkillOrThrow(skillId: string): Promise<SkillEntity> {
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
      select: SKILL_SELECT,
    });

    if (!skill) {
      throw new ForbiddenException('You do not have permission to manage skills');
    }

    return skill;
  }

  private async ensureNameIsAvailable(name: string, excludeSkillId?: string) {
    const existing = await this.prisma.skill.findUnique({
      where: { name: this.normalizeText(name) },
      select: { id: true },
    });

    if (existing && existing.id !== excludeSkillId) {
      throw new ConflictException('A skill with this name already exists');
    }
  }

  private assertCanManage(actor: PublicUser) {
    if (actor.role === UserRole.ADMIN || actor.role === UserRole.OWNER) {
      return;
    }

    throw new ForbiddenException('You do not have permission to manage skills');
  }

  private normalizeText(value?: string | null) {
    return typeof value === 'string' ? value.trim() : '';
  }

  private toSkillView(skill: SkillEntity): SkillView {
    return {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon,
      sortOrder: skill.sortOrder,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    };
  }
}

