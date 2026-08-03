import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AUTH_ROLES_KEY } from '@common/constants/auth.constants';

export const Roles = (...roles: UserRole[]) => SetMetadata(AUTH_ROLES_KEY, roles);
