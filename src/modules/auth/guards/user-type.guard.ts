import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import type { Request } from 'express';
import { TokenType } from '../auth.types';
import { USER_TYPES_KEY } from '../auth.decorator';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredUserTypes = this.reflector.getAllAndOverride<UserType[]>(USER_TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('🔍 Required user types:', requiredUserTypes);

    const request: Request = context.switchToHttp().getRequest();
    let token = request?.cookies?.access_token as string;

    if (!token) {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    console.log('🔍 Token found:', !!token);

    if (!token) {
      console.log('❌ No token found');
      throw new UnauthorizedException();
    }

    try {
      const decodedToken: Record<string, TokenType> = this.jwtService.verify(token, {
        secret: `${process.env.JWT_SECRET_TOKEN}`,
      });

      console.log('🔍 Decoded token:', decodedToken);

      if (!decodedToken || typeof decodedToken !== 'object') {
        console.log('❌ Invalid decoded token');
        throw new ForbiddenException();
      }

      const userType = decodedToken.userType as UserType;
      const siteAdmin = decodedToken.siteAdmin as boolean;

      console.log('🔍 User type:', userType);
      console.log('🔍 Site admin:', siteAdmin);

      // If user is admin, skip all checks
      if (siteAdmin === true) {
        console.log('✅ Admin user, skipping checks');
        return true;
      }

      if (!requiredUserTypes.includes(userType)) {
        console.log('❌ User type not in required types:', userType, 'not in', requiredUserTypes);
        throw new ForbiddenException('This user is not managing a shelter');
      }

      const hasRequiredType = requiredUserTypes.some((type) => userType === type);
      console.log('✅ User has required type:', hasRequiredType);
      return hasRequiredType;
    } catch (error) {
      console.log('❌ Error in UserTypeGuard:', error.message);
      if (error instanceof JsonWebTokenError) {
        throw new ForbiddenException('Invalid token');
      }

      throw new UnauthorizedException();
    }
  }
}
