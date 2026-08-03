import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import {
  AUTH_ROLES_KEY,
  ROLE_HIERARCHY,
} from '@common/constants/auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<UserRole[]>(AUTH_ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: { role?: UserRole } }>();
    const user = request.user;

    if (!user?.role) {
      throw new UnauthorizedException('Authentication required');
    }

    const userRank = ROLE_HIERARCHY[user.role];
    const isAllowed = requiredRoles.some(
      (role) => userRank >= ROLE_HIERARCHY[role],
    );

    if (!isAllowed) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
