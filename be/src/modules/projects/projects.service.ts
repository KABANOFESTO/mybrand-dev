import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProjectStatus, UserRole } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import type {
  ProjectDeleteResult,
  ProjectOwnerSummary,
  ProjectView,
} from './interfaces/project.interfaces';

const PROJECT_OWNER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
} as const satisfies Prisma.UserSelect;

const PROJECT_SELECT = {
  id: true,
  slug: true,
  title: true,
  description: true,
  repositoryUrl: true,
  liveUrl: true,
  imageUrl: true,
  featured: true,
  status: true,
  technologies: true,
  features: true,
  startDate: true,
  endDate: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
  owner: {
    select: PROJECT_OWNER_SELECT,
  },
} as const satisfies Prisma.ProjectSelect;

type ProjectEntity = Prisma.ProjectGetPayload<{ select: typeof PROJECT_SELECT }>;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublicProjects(): Promise<ProjectView[]> {
    const projects = await this.prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      select: PROJECT_SELECT,
    });

    return projects.map((project) => this.toProjectView(project));
  }

  async getPublicProjectBySlug(slug: string): Promise<ProjectView> {
    const project = await this.prisma.project.findUnique({
      where: { slug: this.normalizeSlug(slug) },
      select: PROJECT_SELECT,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.toProjectView(project);
  }

  async createProject(actor: PublicUser, dto: CreateProjectDto): Promise<ProjectView> {
    const data = this.buildCreateData(dto, actor.id);

    if (data.endDate && data.startDate && data.endDate < data.startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    const project = await this.prisma.project.create({
      data,
      select: PROJECT_SELECT,
    });

    return this.toProjectView(project);
  }

  async updateProject(
    actor: PublicUser,
    projectId: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectView> {
    const project = await this.findProjectOrThrow(projectId);
    this.assertCanManage(actor, project);

    const data = this.buildUpdateData(dto);

    if (Object.keys(data).length === 0) {
      return this.toProjectView(project);
    }

    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data,
      select: PROJECT_SELECT,
    });

    return this.toProjectView(updatedProject);
  }

  async deleteProject(
    actor: PublicUser,
    projectId: string,
  ): Promise<ProjectDeleteResult> {
    const project = await this.findProjectOrThrow(projectId);
    this.assertCanManage(actor, project);

    await this.prisma.project.delete({ where: { id: projectId } });

    return { deleted: true };
  }

  private async findProjectOrThrow(projectId: string): Promise<ProjectEntity> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: PROJECT_SELECT,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  private assertCanManage(actor: PublicUser, project: ProjectEntity) {
    if (actor.role === UserRole.ADMIN) {
      return;
    }

    if (actor.role === UserRole.OWNER && project.ownerId === actor.id) {
      return;
    }

    throw new ForbiddenException('You do not have permission to manage this project');
  }

  private buildCreateData(dto: CreateProjectDto, ownerId: string) {
    return {
      slug: this.normalizeSlug(dto.slug),
      title: this.normalizeText(dto.title),
      description: this.normalizeText(dto.description),
      repositoryUrl: this.normalizeText(dto.repositoryUrl),
      liveUrl: this.normalizeText(dto.liveUrl),
      imageUrl: this.normalizeText(dto.imageUrl),
      featured: dto.featured ?? false,
      status: dto.status ?? ProjectStatus.IDEA,
      technologies: this.normalizeArray(dto.technologies),
      features: this.normalizeArray(dto.features),
      startDate: dto.startDate ?? null,
      endDate: dto.endDate ?? null,
      ownerId,
    };
  }

  private buildUpdateData(dto: UpdateProjectDto) {
    const data: Partial<ReturnType<typeof this.buildCreateData>> = {};

    if (dto.slug !== undefined) {
      data.slug = this.normalizeSlug(dto.slug);
    }

    if (dto.title !== undefined) {
      data.title = this.normalizeText(dto.title);
    }

    if (dto.description !== undefined) {
      data.description = this.normalizeText(dto.description);
    }

    if (dto.repositoryUrl !== undefined) {
      data.repositoryUrl = this.normalizeText(dto.repositoryUrl);
    }

    if (dto.liveUrl !== undefined) {
      data.liveUrl = this.normalizeText(dto.liveUrl);
    }

    if (dto.imageUrl !== undefined) {
      data.imageUrl = this.normalizeText(dto.imageUrl);
    }

    if (dto.featured !== undefined) {
      data.featured = dto.featured;
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    if (dto.technologies !== undefined) {
      data.technologies = this.normalizeArray(dto.technologies);
    }

    if (dto.features !== undefined) {
      data.features = this.normalizeArray(dto.features);
    }

    if (dto.startDate !== undefined) {
      data.startDate = dto.startDate;
    }

    if (dto.endDate !== undefined) {
      data.endDate = dto.endDate;
    }

    return data;
  }

  private normalizeSlug(value: string) {
    const slug = this.normalizeText(value).toLowerCase();

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new BadRequestException('slug must contain only lowercase letters, numbers, and hyphens');
    }

    return slug;
  }

  private normalizeText(value?: string | null) {
    if (typeof value !== 'string') {
      return '';
    }

    return value.trim();
  }

  private normalizeArray(values: string[]) {
    const normalized = values.map((value) => this.normalizeText(value)).filter((value) => value.length > 0);

    if (normalized.length === 0) {
      throw new BadRequestException('Array fields cannot be empty');
    }

    return normalized;
  }

  private toProjectView(project: ProjectEntity): ProjectView {
    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      repositoryUrl: project.repositoryUrl,
      liveUrl: project.liveUrl,
      imageUrl: project.imageUrl,
      featured: project.featured,
      status: project.status,
      technologies: project.technologies,
      features: project.features,
      startDate: project.startDate,
      endDate: project.endDate,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      owner: project.owner ? this.toOwnerSummary(project.owner) : null,
    };
  }

  private toOwnerSummary(owner: ProjectEntity['owner']): ProjectOwnerSummary {
    if (!owner) {
      return null as never;
    }

    return {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
      avatarUrl: owner.avatarUrl,
    };
  }
}
