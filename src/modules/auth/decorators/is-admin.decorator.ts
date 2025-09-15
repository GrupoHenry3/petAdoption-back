import { UseGuards, applyDecorators } from '@nestjs/common';
import { AdminGuard } from '../guards/is-admin.guard';

export function IsAdmin() {
  return applyDecorators(UseGuards(AdminGuard));
}
