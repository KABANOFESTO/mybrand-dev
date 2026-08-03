import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '@database/prisma/prisma.service';

@Injectable()
export class BootstrapAdminService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapAdminService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async onApplicationBootstrap() {
    const enabled = this.configService.get<boolean>('auth.bootstrap.enabled', true);
    if (!enabled) {
      return;
    }

    const email = this.configService.get<string>('auth.bootstrap.email', '');
    const password = this.configService.get<string>('auth.bootstrap.password', '');
    const name = this.configService.get<string>('auth.bootstrap.name', 'Portfolio Owner');
    const role = this.configService.get<UserRole>('auth.bootstrap.role', UserRole.OWNER);

    if (!email || !password) {
      this.logger.warn(
        'Bootstrap admin skipped because BOOTSTRAP_ADMIN_EMAIL or BOOTSTRAP_ADMIN_PASSWORD is missing',
      );
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true },
    });

    if (existingUser) {
      await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          passwordHash,
          role,
          isActive: true,
          emailVerifiedAt: new Date(),
        },
      });

      this.logger.log(`Bootstrap user updated for ${email}`);
      return;
    }

    await this.prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name,
        passwordHash,
        role,
        isActive: true,
        emailVerifiedAt: new Date(),
      },
    });

    this.logger.log(`Bootstrap user created for ${email}`);
  }
}
