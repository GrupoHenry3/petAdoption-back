import {
  AdoptionStatus,
} from '@prisma/client';
import { IsString, IsEnum, IsOptional, Length } from 'class-validator';

// Enums que coinciden con el esquema de Prisma
enum previousPetExp {
  None = 'None',
  Basic = 'Basic',
  Moderate = 'Moderate',
  Experienced = 'Experienced',
}

enum houseType {
  House = 'House',
  Apartment = 'Apartment',
  Farm = 'Farm',
}

enum houseOwnership {
  Owned = 'Owned',
  Rented = 'Rented',
}

enum houseOuterSpace {
  None = 'None',
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
}

export class AdoptionDTO {
  @IsString()
  @Length(6, 20)
  dni: string;

  @IsString()
  birthdate: string;

  @IsString()
  mainReason: string;

  @IsString()
  expectatives: string;

  @IsEnum(previousPetExp, { message: 'La experiencia previa no es válida' })
  previousPetExp: previousPetExp;

  @IsEnum(houseType, { message: 'El tipo de vivienda no es válido' })
  houseType: houseType;

  @IsEnum(houseOwnership, { message: 'La propiedad de la vivienda no es válida' })
  houseOwnership: houseOwnership;

  @IsEnum(houseOuterSpace, { message: 'El espacio exterior no es válido' })
  houseOuterSpace: houseOuterSpace;

  @IsString()
  workingHours: string;

  @IsString()
  dailyRoutine: string;

  @IsString()
  houseMembers: string;

  @IsString()
  livingSpace: string;

  @IsString()
  @IsOptional()
  houseKidsAges?: string;

  @IsString()
  @IsOptional()
  houseCurrentPets?: string;

  @IsString()
  @IsOptional()
  dailyExcercise?: string;

  @IsString()
  @IsOptional()
  travelFrequency?: string;

  @IsString()
  @IsOptional()
  petHistory?: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;

  @IsString()
  shelterID: string;

  @IsString()
  petID: string;
}

export class UpdateAdoptionDTO {
  @IsOptional()
  @IsEnum(AdoptionStatus)
  status?: AdoptionStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
