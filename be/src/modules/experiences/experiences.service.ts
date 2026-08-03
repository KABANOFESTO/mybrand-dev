import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import type { ExperienceDeleteResult, ExperienceView } from './interfaces/experience.interfaces';

const EXPERIENCE_SELECT = {
  id: true,
  company: true,
  role: true,
  location: true,
  description: true,
  startDate: true,
  endDate: true,
  current: true,
  technologies: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.ExperienceSelect;

type ExperienceEntity = Prisma.ExperienceGetPayload<{ select: typeof EXPERIENCE_SELECT }>;

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  async listExperiences(): Promise<ExperienceView[]> {
    const experiences = await this.prisma.experience.findMany({
      orderBy: [{ current: 'desc' }, { startDate: 'desc' }, { createdAt: 'desc' }],
      select: EXPERIENCE_SELECT,
    });

    return experiences.map((experience) => this.toView(experience));
  }

  async getExperienceById(id: string): Promise<ExperienceView> {
    const experience = await this.findExperienceOrThrow(id);
    return this.toView(experience);
  }

  async createExperience(actor: PublicUser, dto: CreateExperienceDto): Promise<ExperienceView> {
    this.assertCanManage(actor);
    this.validateDates(dto.startDate, dto.endDate, dto.current);

    const experience = await this.prisma.experience.create({
      data: this.buildData(dto),
      select: EXPERIENCE_SELECT,
    });

    return this.toView(experience);
  }

  async updateExperience(
    actor: PublicUser,
    id: string,
    dto: UpdateExperienceDto,
  ): Promise<ExperienceView> {
    this.assertCanManage(actor);
    const existing = await this.findExperienceOrThrow(id);

    const data = this.buildUpdateData(dto);
    if (Object.keys(data).length === 0) {
      return this.toView(existing);
    }

    this.validateDates(
      data.startDate ?? existing.startDate,
      data.endDate === undefined ? existing.endDate : data.endDate,
      data.current === undefined ? existing.current : data.current,
    );

    const experience = await this.prisma.experience.update({
      where: { id },
      data,
      select: EXPERIENCE_SELECT,
    });

    return this.toView(experience);
  }

  async deleteExperience(actor: PublicUser, id: string): Promise<ExperienceDeleteResult> {
    this.assertCanManage(actor);
    await this.findExperienceOrThrow(id);

    await this.prisma.experience.delete({ where: { id } });
    return { deleted: true };
  }

  private async findExperienceOrThrow(id: string): Promise<ExperienceEntity> {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
      select: EXPERIENCE_SELECT,
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    return experience;
  }

  private assertCanManage(actor: PublicUser) {
    if (actor.role === UserRole.ADMIN || actor.role === UserRole.OWNER) {
      return;
    }

    throw new ForbiddenException('You do not have permission to manage experiences');
  }

  private buildData(dto: CreateExperienceDto) {
    return {
      company: this.normalizeText(dto.company),
      role: this.normalizeText(dto.role),
      location: this.normalizeText(dto.location),
      description: this.normalizeText(dto.description),
      startDate: dto.startDate,
      endDate: dto.current ? null : dto.endDate ?? null,
      current: dto.current ?? false,
      technologies: this.normalizeArray(dto.technologies),
    };
  }

  private buildUpdateData(dto: UpdateExperienceDto) {
    const data: Partial<ReturnType<typeof this.buildData>> = {};

    if (dto.company !== undefined) data.company = this.normalizeText(dto.company);
    if (dto.role !== undefined) data.role = this.normalizeText(dto.role);
    if (dto.location !== undefined) data.location = this.normalizeText(dto.location);
    if (dto.description !== undefined) data.description = this.normalizeText(dto.description);
    if (dto.startDate !== undefined) data.startDate = dto.startDate;
    if (dto.endDate !== undefined) data.endDate = dto.endDate;
    if (dto.current !== undefined) data.current = dto.current;
    if (dto.technologies !== undefined) data.technologies = this.normalizeArray(dto.technologies);

    if (data.current === true) {
      data.endDate = null;
    }

    return data;
  }

  private validateDates(startDate?: Date | null, endDate?: Date | null, current?: boolean) {
    if (!startDate) {
      throw new BadRequestException('startDate is required');
    }

    if (current && endDate) {
      throw new BadRequestException('endDate must be empty when current is true');
    }

    if (endDate && endDate < startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }
  }

  private normalizeText(value?: string | null) {
    const normalized = typeof value === 'string' ? value.trim() : '';
    if (!normalized) {
      throw new BadRequestException('Required fields cannot be empty');
    }

    return normalized;
  }

  private normalizeArray(values: string[]) {
    const normalized = values.map((value) => value.trim()).filter((value) => value.length > 0);

    if (normalized.length === 0) {
      throw new BadRequestException('technologies cannot be empty');
    }

    return normalized;
  }

  private toView(experience: ExperienceEntity): ExperienceView {
    return {
      id: experience.id,
      company: experience.company,
      role: experience.role,
      location: experience.location,
      description: experience.description,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      technologies: experience.technologies,
      createdAt: experience.createdAt,
      updatedAt: experience.updatedAt,
    };
  }
}
