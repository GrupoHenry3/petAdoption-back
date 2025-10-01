import { PetGender, PetSize } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePetDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsEnum(PetGender)
  @IsNotEmpty()
  gender: PetGender;

  @IsEnum(PetSize)
  @IsNotEmpty()
  size: PetSize;

  @IsNumber()
  @IsNotEmpty()
  adoptionFee: number;

  @IsString()
  @IsNotEmpty()
  avatarURL: string;

  @IsBoolean()
  @IsOptional()
  neutered: boolean;

  @IsBoolean()
  @IsOptional()
  trained: boolean;

  @IsBoolean()
  @IsOptional()
  goodWithKids: boolean;

  @IsBoolean()
  @IsOptional()
  goodWithPets: boolean;

  @IsString()
  @IsNotEmpty()
  shelterID: string;

  @IsString()
  @IsNotEmpty()
  breedID: string;

  @IsString()
  @IsNotEmpty()
  speciesID: string;
}
