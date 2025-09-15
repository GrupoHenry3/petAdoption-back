import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly JwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = this.JwtService.verify(token, {
        secret: `${process.env.JWT_SECRET_TOKEN}`,
      });

      if (!decodedToken || typeof decodedToken !== 'object' || !('siteAdmin' in decodedToken)) {
        throw new ForbiddenException();
      }

      const siteAdmin = decodedToken.siteAdmin;

      if (siteAdmin === true) {
        return true;
      } else {
        throw new ForbiddenException('User has no administrator priviledges');
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new ForbiddenException('Invalid token');
      }

      throw new UnauthorizedException();
    }
  }
}
