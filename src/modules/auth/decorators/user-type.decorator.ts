import { SetMetadata } from '@nestjs/common';
import { Type } from '../enums/type.enum';

export const TYPES_KEY = 'types';
export const Types = (...types: [Type, ...Type[]]) => SetMetadata(TYPES_KEY, types);
