import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { TYPES_KEY } from '../decorators/user-type.decorator';
import { Type } from '../enums/type.enum';

@Injectable()
export class TypesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredType = this.reflector.getAllAndOverride<Type[]>(TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredType) return true;
    const user = context.switchToHttp().getRequest().user;
    console.log({ user });
    const hasRequiredType = requiredType.some((type) => user.type === type);
    return hasRequiredType;
  }
}
