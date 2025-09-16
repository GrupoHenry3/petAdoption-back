import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserType } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { USER_TYPES_KEY } from '../decorators/user-type.decorator';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = request?.cookies?.access_token;

    if (!token) {
      const authHeader = request.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    const requiredUserTypes = this.reflector.getAllAndOverride<UserType[]>(USER_TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: `${process.env.JWT_SECRET_TOKEN}`,
      });

      if (!decodedToken || typeof decodedToken !== 'object' || !('type' in decodedToken)) {
        throw new ForbiddenException();
      }

      const userType = decodedToken.type;

      if (!requiredUserTypes.includes(userType)) {
        throw new ForbiddenException('This user is not managing a shelter');
      }

      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new ForbiddenException('Invalid token');
      }

      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }

      throw new UnauthorizedException('Authentication failed due to an unexpected error');
    }
  }
}
