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

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private readonly JwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Intentar obtener token de cookie primero
    let token = request?.cookies?.access_token;
    
    // Fallback: obtener de header Authorization
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
      const decodedToken = this.JwtService.verify(token, {
        secret: `${process.env.JWT_SECRET}`,
      });

      if (!decodedToken || typeof decodedToken !== 'object' || !('type' in decodedToken)) {
        throw new ForbiddenException();
      }

      const userType = decodedToken.type;

      if (userType === UserType.Shelter) {
        return true;
      } else if (userType === UserType.User) {
        return true;
      } else {
        throw new ForbiddenException('User is not a Shelter');
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new ForbiddenException('Invalid token');
      }

      throw new UnauthorizedException();
    }
  }
}
