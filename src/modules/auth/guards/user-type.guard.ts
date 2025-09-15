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
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = this.JwtService.verify(token);

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
