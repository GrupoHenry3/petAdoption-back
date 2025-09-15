import { IsBoolean } from 'class-validator';

export class UpdateStatusUserDto {
  @IsBoolean()
  isActive: boolean;
}

