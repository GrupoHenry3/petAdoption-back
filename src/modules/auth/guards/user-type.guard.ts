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

    const request: Request = context.switchToHttp().getRequest();
    let token = request?.cookies?.access_token as string;

    if (!token) {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: `${process.env.JWT_SECRET_TOKEN}`,
      });

      if (!decodedToken || typeof decodedToken !== 'object') {
        throw new ForbiddenException();
      }

      console.log(decodedToken);

      const userType = decodedToken.userType as UserType;
      const siteAdmin = decodedToken.siteAdmin as boolean;

      if (siteAdmin === true) {
        return true;
      }

      if (!requiredUserTypes.includes(userType)) {
        throw new ForbiddenException('This user is not managing a shelter');
      }

      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new ForbiddenException('Invalid token');
      }

      throw new UnauthorizedException();
    }
  }
}
