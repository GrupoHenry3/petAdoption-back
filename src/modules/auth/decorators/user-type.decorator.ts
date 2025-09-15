import { SetMetadata } from '@nestjs/common';
import { UserType } from '@prisma/client';

export const TYPES_KEY = 'types';
export const UserTypes = (...types: [UserType, ...UserType[]]) => SetMetadata(TYPES_KEY, types);
