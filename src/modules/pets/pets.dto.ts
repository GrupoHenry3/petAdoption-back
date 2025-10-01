import { PetGender, PetSize } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Species } from '../species/species.dto';

export class Pet {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsEnum(PetGender)
  gender: PetGender;

  @IsEnum(PetSize)
  size: PetSize;

  @IsNumber()
  adoptionFee: number;

  @IsString()
  avatarURL: string;

  @IsBoolean()
  neutered: boolean;

  @IsBoolean()
  trained: boolean;

  @IsBoolean()
  goodWithKids: boolean;

  @IsBoolean()
  goodWithPets: boolean;

  @IsObject()
  shelterID: {
    id: string;
    name: string;
    city: string;
    state: string;
    country: string;
  };

  @IsObject()
  breedID: {
    id: string;
    name: string;
  };

  @IsObject()
  species: {
    id: string;
    name: string;
  };

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

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

export class UpdatePetDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsEnum(PetGender)
  @IsOptional()
  gender: PetGender;

  @IsEnum(PetSize)
  @IsOptional()
  size: PetSize;

  @IsNumber()
  @IsOptional()
  adoptionFee: number;

  @IsString()
  @IsOptional()
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
  @IsOptional()
  shelterID: string;

  @IsString()
  @IsOptional()
  breedID: string;

  @IsString()
  @IsOptional()
  speciesID: string;
}
