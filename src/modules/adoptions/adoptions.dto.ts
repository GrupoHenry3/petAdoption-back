import { ApiProperty } from '@nestjs/swagger';
import {
  AdoptionStatus,
  houseOuterSpace,
  houseOwnership,
  houseType,
  previousPetExp,
} from '@prisma/client';
import { IsString, IsEnum, IsOptional, Length } from 'class-validator';

export class Adoption {
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @Length(6, 20)
  id: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @Length(6, 20)
  dni: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  birthdate: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  mainReason: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  expectatives: string;

  @ApiProperty({
    type: 'string',
    example: previousPetExp,
  })
  @IsEnum(previousPetExp)
  previousPetExp: previousPetExp;

  @ApiProperty({
    type: 'string',
    example: houseType,
  })
  @IsEnum(houseType)
  houseType: houseType;

  @ApiProperty({
    type: 'string',
    example: houseOwnership,
  })
  @IsEnum(houseOwnership)
  houseOwnership: houseOwnership;

  @ApiProperty({
    type: 'string',
    example: houseOuterSpace,
  })
  @IsEnum(houseOuterSpace)
  houseOuterSpace: houseOuterSpace;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  workingHours: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  dailyRoutine: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  houseMembers: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  livingSpace: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  houseKidsAges?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  houseCurrentPets?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  dailyExcercise?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  travelFrequency?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  petHistory?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  additionalInfo?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  shelterID: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  petID: string;
}

export class AdoptionDTO {
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @Length(6, 20)
  dni: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  birthdate: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  mainReason: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  expectatives: string;

  @ApiProperty({
    type: 'string',
    example: previousPetExp,
  })
  @IsEnum(previousPetExp, { message: 'La experiencia previa no es válida' })
  previousPetExp: previousPetExp;

  @ApiProperty({
    type: 'string',
    example: houseType,
  })
  @IsEnum(houseType, { message: 'El tipo de vivienda no es válido' })
  houseType: houseType;

  @ApiProperty({
    type: 'string',
    example: houseOwnership,
  })
  @IsEnum(houseOwnership, { message: 'La propiedad de la vivienda no es válida' })
  houseOwnership: houseOwnership;

  @ApiProperty({
    type: 'string',
    example: houseOuterSpace,
  })
  @IsEnum(houseOuterSpace, { message: 'El espacio exterior no es válido' })
  houseOuterSpace: houseOuterSpace;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  workingHours: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  dailyRoutine: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  houseMembers: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  livingSpace: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  houseKidsAges?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  houseCurrentPets?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  dailyExcercise?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  travelFrequency?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  petHistory?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  additionalInfo?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  shelterID: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  petID: string;
}

export class UpdateAdoptionDTO {
  @ApiProperty({
    type: 'string',
    example: AdoptionStatus,
  })
  @IsOptional()
  @IsEnum(AdoptionStatus)
  status?: AdoptionStatus;

  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
