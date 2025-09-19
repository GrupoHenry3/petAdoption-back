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
  constructor(private readonly jwtService: JwtService) {}

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

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: `${process.env.JWT_SECRET_TOKEN}`,
      });

      if (!decodedToken || typeof decodedToken !== 'object' || !('siteAdmin' in decodedToken)) {
        throw new ForbiddenException();
      }

      const siteAdmin = decodedToken.siteAdmin;

      if (siteAdmin === false) {
        throw new ForbiddenException('User has no administrator priviledges');
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
