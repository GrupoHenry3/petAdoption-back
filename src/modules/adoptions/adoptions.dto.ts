import { ApiProperty } from '@nestjs/swagger';
import {
  AdoptionStatus,
  HouseOuterSpace,
  HouseOwnership,
  HouseType,
  PreviousPetExp,
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
    example: PreviousPetExp,
  })
  @IsEnum(PreviousPetExp)
  previousPetExp: PreviousPetExp;

  @ApiProperty({
    type: 'string',
    example: HouseType,
  })
  @IsEnum(HouseType)
  houseType: HouseType;

  @ApiProperty({
    type: 'string',
    example: HouseOwnership,
  })
  @IsEnum(HouseOwnership)
  houseOwnership: HouseOwnership;

  @ApiProperty({
    type: 'string',
    example: HouseOuterSpace,
  })
  @IsEnum(HouseOuterSpace)
  houseOuterSpace: HouseOuterSpace;

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
    example: PreviousPetExp,
  })
  @IsEnum(PreviousPetExp, { message: 'La experiencia previa no es válida' })
  previousPetExp: PreviousPetExp;

  @ApiProperty({
    type: 'string',
    example: HouseType,
  })
  @IsEnum(HouseType, { message: 'El tipo de vivienda no es válido' })
  houseType: HouseType;

  @ApiProperty({
    type: 'string',
    example: HouseOwnership,
  })
  @IsEnum(HouseOwnership, { message: 'La propiedad de la vivienda no es válida' })
  houseOwnership: HouseOwnership;

  @ApiProperty({
    type: 'string',
    example: HouseOuterSpace,
  })
  @IsEnum(HouseOuterSpace, { message: 'El espacio exterior no es válido' })
  houseOuterSpace: HouseOuterSpace;

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
