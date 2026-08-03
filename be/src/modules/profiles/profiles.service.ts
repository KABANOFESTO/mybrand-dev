import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { SaveProfileDto } from './dto/save-profile.dto';
import type { ProfileDetails, ProfileSummary, ProfileView } from './interfaces/profile.interfaces';

const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  avatarUrl: true,
  isActive: true,
  emailVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.UserSelect;

const PROFILE_SELECT = {
  id: true,
  headline: true,
  bio: true,
  about: true,
  location: true,
  website: true,
  github: true,
  linkedin: true,
  resumeUrl: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.ProfileSelect;

const PROFILE_SUMMARY_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  isActive: true,
  profile: {
    select: {
      headline: true,
      location: true,
      website: true,
      github: true,
      linkedin: true,
      resumeUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const satisfies Prisma.UserSelect;

type PublicUserEntity = Prisma.UserGetPayload<{ select: typeof PUBLIC_USER_SELECT }>;
type ProfileEntity = Prisma.ProfileGetPayload<{ select: typeof PROFILE_SELECT }>;
type ProfileSummaryEntity = Prisma.UserGetPayload<{ select: typeof PROFILE_SUMMARY_SELECT }>;

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicProfile(userId: string): Promise<ProfileView> {
    const user = await this.findActiveUserOrThrow(userId, false);
    return this.toProfileView(user);
  }

  async getMyProfile(userId: string): Promise<ProfileView> {
    const user = await this.findActiveUserOrThrow(userId, true);
    return this.toProfileView(user);
  }

  async saveMyProfile(userId: string, dto: SaveProfileDto): Promise<ProfileView> {
    const user = await this.findActiveUserOrThrow(userId, true);
    const payload = this.normalizeProfilePayload(dto);

    if (this.isEmptyProfilePayload(payload)) {
      return this.toProfileView(user);
    }

    await this.prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        ...payload,
      },
      update: payload,
    });

    return this.toProfileView(user);
  }

  async getProfileSummary(userId: string): Promise<ProfileSummary> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: PROFILE_SUMMARY_SELECT,
    });

    if (!user || !user.role || !user.isActive) {
      throw new NotFoundException('Profile not found');
    }

    return this.toProfileSummary(user);
  }

  private async findActiveUserOrThrow(userId: string, requireProfileAccess: boolean): Promise<PublicUserEntity & { profile: ProfileEntity | null }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...PUBLIC_USER_SELECT,
        profile: {
          select: PROFILE_SELECT,
        },
      },
    });

    if (!user || !user.isActive) {
      if (requireProfileAccess) {
        throw new UnauthorizedException('User account is not active');
      }

      throw new NotFoundException('Profile not found');
    }

    return user;
  }

  private toProfileView(user: PublicUserEntity & { profile: ProfileEntity | null }): ProfileView {
    return {
      user: this.toPublicUser(user),
      profile: user.profile ? this.toProfileDetails(user.profile) : null,
    };
  }

  private toProfileDetails(profile: ProfileEntity): ProfileDetails {
    return {
      id: profile.id,
      headline: profile.headline,
      bio: profile.bio,
      about: profile.about,
      location: profile.location,
      website: profile.website,
      github: profile.github,
      linkedin: profile.linkedin,
      resumeUrl: profile.resumeUrl,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  private toPublicUser(user: PublicUserEntity): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private toProfileSummary(user: ProfileSummaryEntity): ProfileSummary {
    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      headline: user.profile?.headline ?? null,
      location: user.profile?.location ?? null,
      website: user.profile?.website ?? null,
      github: user.profile?.github ?? null,
      linkedin: user.profile?.linkedin ?? null,
      resumeUrl: user.profile?.resumeUrl ?? null,
      createdAt: user.profile?.createdAt ?? new Date(0),
      updatedAt: user.profile?.updatedAt ?? new Date(0),
    };
  }

  private normalizeProfilePayload(dto: SaveProfileDto) {
    return {
      headline: this.normalizeText(dto.headline),
      bio: this.normalizeText(dto.bio),
      about: this.normalizeText(dto.about),
      location: this.normalizeText(dto.location),
      website: this.normalizeText(dto.website),
      github: this.normalizeText(dto.github),
      linkedin: this.normalizeText(dto.linkedin),
      resumeUrl: this.normalizeText(dto.resumeUrl),
    };
  }

  private normalizeText(value?: string) {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private isEmptyProfilePayload(payload: Record<string, string | undefined>) {
    return Object.values(payload).every((value) => value === undefined);
  }
}
