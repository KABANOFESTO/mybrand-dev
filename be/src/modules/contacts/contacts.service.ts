import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ContactStatus, UserRole } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import type { ContactDeleteResult, ContactView } from './interfaces/contact.interfaces';

const CONTACT_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  avatarUrl: true,
} as const satisfies Prisma.UserSelect;

const CONTACT_SELECT = {
  id: true,
  name: true,
  email: true,
  subject: true,
  message: true,
  status: true,
  source: true,
  respondedAt: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: CONTACT_USER_SELECT,
  },
} as const satisfies Prisma.ContactMessageSelect;

type ContactEntity = Prisma.ContactMessageGetPayload<{ select: typeof CONTACT_SELECT }>;

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async createContact(dto: CreateContactDto, userId?: string): Promise<ContactView> {
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new BadRequestException('Invalid user account');
      }
    }

    const contact = await this.prisma.contactMessage.create({
      data: {
        name: this.normalizeRequiredText(dto.name),
        email: this.normalizeEmail(dto.email),
        subject: this.normalizeRequiredText(dto.subject),
        message: this.normalizeRequiredText(dto.message),
        source: this.normalizeOptionalText(dto.source),
        userId: userId ?? null,
      },
      select: CONTACT_SELECT,
    });

    return this.toView(contact);
  }

  async listContacts(params?: { status?: ContactStatus }): Promise<ContactView[]> {
    const contacts = await this.prisma.contactMessage.findMany({
      where: params?.status ? { status: params.status } : undefined,
      orderBy: [{ createdAt: 'desc' }],
      select: CONTACT_SELECT,
    });

    return contacts.map((contact) => this.toView(contact));
  }

  async getContactById(id: string): Promise<ContactView> {
    const contact = await this.findContactOrThrow(id);
    return this.toView(contact);
  }

  async updateContact(id: string, dto: UpdateContactDto): Promise<ContactView> {
    const existing = await this.findContactOrThrow(id);

    const data: Prisma.ContactMessageUpdateInput = {};

    if (dto.status !== undefined) {
      data.status = dto.status;
      if (dto.status === ContactStatus.RESOLVED && !dto.respondedAt && !existing.respondedAt) {
        data.respondedAt = new Date();
      }
    }

    if (dto.respondedAt !== undefined) {
      data.respondedAt = dto.respondedAt;
      if (dto.respondedAt && existing.status === ContactStatus.NEW) {
        data.status = ContactStatus.IN_PROGRESS;
      }
    }


    const updated = await this.prisma.contactMessage.update({
      where: { id },
      data,
      select: CONTACT_SELECT,
    });

    return this.toView(updated);
  }

  async deleteContact(id: string): Promise<ContactDeleteResult> {
    await this.findContactOrThrow(id);
    await this.prisma.contactMessage.delete({ where: { id } });
    return { deleted: true };
  }

  private async findContactOrThrow(id: string): Promise<ContactEntity> {
    const contact = await this.prisma.contactMessage.findUnique({
      where: { id },
      select: CONTACT_SELECT,
    });

    if (!contact) {
      throw new NotFoundException('Contact message not found');
    }

    return contact;
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

  private normalizeEmail(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      throw new BadRequestException('Email is required');
    }

    return normalized;
  }

  private toView(contact: ContactEntity): ContactView {
    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      status: contact.status,
      source: contact.source,
      respondedAt: contact.respondedAt,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      user: contact.user,
    };
  }
}

