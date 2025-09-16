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

      if (!decodedToken || typeof decodedToken !== 'object' || !('site_admin' in decodedToken)) {
        throw new ForbiddenException();
      }

      const siteAdmin = decodedToken.site_admin;

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
