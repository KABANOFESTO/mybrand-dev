import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import type { CertificateDeleteResult, CertificateView } from './interfaces/certificate.interfaces';

const CERTIFICATE_SELECT = {
  id: true,
  title: true,
  issuer: true,
  credentialId: true,
  issuedAt: true,
  expiredAt: true,
  verificationUrl: true,
  pdfUrl: true,
  imageUrl: true,
  skills: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.CertificateSelect;

type CertificateEntity = Prisma.CertificateGetPayload<{ select: typeof CERTIFICATE_SELECT }>;

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  async listCertificates(): Promise<CertificateView[]> {
    const certificates = await this.prisma.certificate.findMany({
      orderBy: [{ issuedAt: 'desc' }, { createdAt: 'desc' }],
      select: CERTIFICATE_SELECT,
    });

    return certificates.map((certificate) => this.toView(certificate));
  }

  async getCertificateById(id: string): Promise<CertificateView> {
    const certificate = await this.findCertificateOrThrow(id);
    return this.toView(certificate);
  }

  async createCertificate(actor: PublicUser, dto: CreateCertificateDto): Promise<CertificateView> {
    this.assertCanManage(actor);
    this.validateDates(dto.issuedAt, dto.expiredAt);

    const certificate = await this.prisma.certificate.create({
      data: this.buildCreateData(dto),
      select: CERTIFICATE_SELECT,
    });

    return this.toView(certificate);
  }

  async updateCertificate(
    actor: PublicUser,
    id: string,
    dto: UpdateCertificateDto,
  ): Promise<CertificateView> {
    this.assertCanManage(actor);
    const existing = await this.findCertificateOrThrow(id);

    const data = this.buildUpdateData(dto);
    if (Object.keys(data).length === 0) {
      return this.toView(existing);
    }

    this.validateDates(
      data.issuedAt ?? existing.issuedAt,
      data.expiredAt === undefined ? existing.expiredAt : data.expiredAt,
    );

    const certificate = await this.prisma.certificate.update({
      where: { id },
      data,
      select: CERTIFICATE_SELECT,
    });

    return this.toView(certificate);
  }

  async deleteCertificate(actor: PublicUser, id: string): Promise<CertificateDeleteResult> {
    this.assertCanManage(actor);
    await this.findCertificateOrThrow(id);

    await this.prisma.certificate.delete({ where: { id } });
    return { deleted: true };
  }

  private async findCertificateOrThrow(id: string): Promise<CertificateEntity> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
      select: CERTIFICATE_SELECT,
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  private assertCanManage(actor: PublicUser) {
    if (actor.role === UserRole.ADMIN || actor.role === UserRole.OWNER) {
      return;
    }

    throw new ForbiddenException('You do not have permission to manage certificates');
  }

  private buildCreateData(dto: CreateCertificateDto) {
    return {
      title: this.normalizeRequiredText(dto.title),
      issuer: this.normalizeRequiredText(dto.issuer),
      credentialId: this.normalizeOptionalText(dto.credentialId),
      issuedAt: dto.issuedAt,
      expiredAt: dto.expiredAt ?? null,
      verificationUrl: this.normalizeOptionalText(dto.verificationUrl),
      pdfUrl: this.normalizeOptionalText(dto.pdfUrl),
      imageUrl: this.normalizeOptionalText(dto.imageUrl),
      skills: this.normalizeArray(dto.skills),
    };
  }

  private buildUpdateData(dto: UpdateCertificateDto) {
    const data: Partial<ReturnType<typeof this.buildCreateData>> = {};

    if (dto.title !== undefined) data.title = this.normalizeRequiredText(dto.title);
    if (dto.issuer !== undefined) data.issuer = this.normalizeRequiredText(dto.issuer);
    if (dto.credentialId !== undefined) data.credentialId = this.normalizeOptionalText(dto.credentialId);
    if (dto.issuedAt !== undefined) data.issuedAt = dto.issuedAt;
    if (dto.expiredAt !== undefined) data.expiredAt = dto.expiredAt;
    if (dto.verificationUrl !== undefined) data.verificationUrl = this.normalizeOptionalText(dto.verificationUrl);
    if (dto.pdfUrl !== undefined) data.pdfUrl = this.normalizeOptionalText(dto.pdfUrl);
    if (dto.imageUrl !== undefined) data.imageUrl = this.normalizeOptionalText(dto.imageUrl);
    if (dto.skills !== undefined) data.skills = this.normalizeArray(dto.skills);

    return data;
  }

  private validateDates(issuedAt?: Date | null, expiredAt?: Date | null) {
    if (!issuedAt) {
      throw new BadRequestException('issuedAt is required');
    }

    if (expiredAt && expiredAt < issuedAt) {
      throw new BadRequestException('expiredAt must be after issuedAt');
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

  private normalizeArray(values: string[]) {
    const normalized = values.map((value) => value.trim()).filter((value) => value.length > 0);

    if (normalized.length === 0) {
      throw new BadRequestException('skills cannot be empty');
    }

    return normalized;
  }

  private toView(certificate: CertificateEntity): CertificateView {
    return {
      id: certificate.id,
      title: certificate.title,
      issuer: certificate.issuer,
      credentialId: certificate.credentialId,
      issuedAt: certificate.issuedAt,
      expiredAt: certificate.expiredAt,
      verificationUrl: certificate.verificationUrl,
      pdfUrl: certificate.pdfUrl,
      imageUrl: certificate.imageUrl,
      skills: certificate.skills,
      createdAt: certificate.createdAt,
      updatedAt: certificate.updatedAt,
    };
  }
}
