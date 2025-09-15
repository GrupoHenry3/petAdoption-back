import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const isSiteAdmin = request.site_admin;

    if (isSiteAdmin === true) {
      return true;
    } else {
      throw new ForbiddenException(
        'Access Denied: You do not have site administration privileges.',
      );
    }
  }
}
