import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import type { EducationDeleteResult, EducationView } from './interfaces/education.interfaces';

const EDUCATION_SELECT = {
  id: true,
  institution: true,
  degree: true,
  field: true,
  location: true,
  score: true,
  startDate: true,
  endDate: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.EducationSelect;

type EducationEntity = Prisma.EducationGetPayload<{ select: typeof EDUCATION_SELECT }>;

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async listEducation(): Promise<EducationView[]> {
    const education = await this.prisma.education.findMany({
      orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
      select: EDUCATION_SELECT,
    });

    return education.map((item) => this.toView(item));
  }

  async getEducationById(id: string): Promise<EducationView> {
    const item = await this.findEducationOrThrow(id);
    return this.toView(item);
  }

  async createEducation(actor: PublicUser, dto: CreateEducationDto): Promise<EducationView> {
    this.assertCanManage(actor);
    this.validateDates(dto.startDate, dto.endDate);

    const item = await this.prisma.education.create({
      data: this.buildData(dto),
      select: EDUCATION_SELECT,
    });

    return this.toView(item);
  }

  async updateEducation(
    actor: PublicUser,
    id: string,
    dto: UpdateEducationDto,
  ): Promise<EducationView> {
    this.assertCanManage(actor);
    const existing = await this.findEducationOrThrow(id);

    const data = this.buildUpdateData(dto);
    if (Object.keys(data).length === 0) {
      return this.toView(existing);
    }

    this.validateDates(
      data.startDate ?? existing.startDate,
      data.endDate === undefined ? existing.endDate : data.endDate,
    );

    const item = await this.prisma.education.update({
      where: { id },
      data,
      select: EDUCATION_SELECT,
    });

    return this.toView(item);
  }

  async deleteEducation(actor: PublicUser, id: string): Promise<EducationDeleteResult> {
    this.assertCanManage(actor);
    await this.findEducationOrThrow(id);

    await this.prisma.education.delete({ where: { id } });
    return { deleted: true };
  }

  private async findEducationOrThrow(id: string): Promise<EducationEntity> {
    const item = await this.prisma.education.findUnique({
      where: { id },
      select: EDUCATION_SELECT,
    });

    if (!item) {
      throw new NotFoundException('Education not found');
    }

    return item;
  }

  private assertCanManage(actor: PublicUser) {
    if (actor.role === UserRole.ADMIN || actor.role === UserRole.OWNER) {
      return;
    }

    throw new ForbiddenException('You do not have permission to manage education');
  }

  private buildData(dto: CreateEducationDto) {
    return {
      institution: this.normalizeRequiredText(dto.institution),
      degree: this.normalizeRequiredText(dto.degree),
      field: this.normalizeRequiredText(dto.field),
      location: this.normalizeOptionalText(dto.location),
      score: this.normalizeOptionalText(dto.score),
      startDate: dto.startDate,
      endDate: dto.endDate ?? null,
    };
  }

  private buildUpdateData(dto: UpdateEducationDto) {
    const data: Partial<ReturnType<typeof this.buildData>> = {};

    if (dto.institution !== undefined) data.institution = this.normalizeRequiredText(dto.institution);
    if (dto.degree !== undefined) data.degree = this.normalizeRequiredText(dto.degree);
    if (dto.field !== undefined) data.field = this.normalizeRequiredText(dto.field);
    if (dto.location !== undefined) data.location = this.normalizeOptionalText(dto.location);
    if (dto.score !== undefined) data.score = this.normalizeOptionalText(dto.score);
    if (dto.startDate !== undefined) data.startDate = dto.startDate;
    if (dto.endDate !== undefined) data.endDate = dto.endDate;

    return data;
  }

  private validateDates(startDate?: Date | null, endDate?: Date | null) {
    if (!startDate) {
      throw new BadRequestException('startDate is required');
    }

    if (endDate && endDate < startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }
  }

  private normalizeRequiredText(value: string) {
    const normalized = value.trim();
    if (!normalized) {
      throw new BadRequestException('Required fields cannot be empty');
    }

    return normalized;
  }

  private normalizeOptionalText(value?: string | null) {
    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private toView(item: EducationEntity): EducationView {
    return {
      id: item.id,
      institution: item.institution,
      degree: item.degree,
      field: item.field,
      location: item.location,
      score: item.score,
      startDate: item.startDate,
      endDate: item.endDate,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
