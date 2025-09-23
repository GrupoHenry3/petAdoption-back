import { PartialType } from '@nestjs/mapped-types';
import { CreateAdoptionDto } from './create-adoption.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EAdoptionStatus } from '@prisma/client';

export class UpdateAdoptionDto extends PartialType(CreateAdoptionDto) {
  @IsOptional()
  @IsEnum(EAdoptionStatus)
  status?: EAdoptionStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}