import { ApiProperty } from '@nestjs/swagger';
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

export class Pet {
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'number',
  })
  @IsNumber()
  age: number;

  @ApiProperty({
    type: 'string',
    example: PetGender,
  })
  @IsEnum(PetGender)
  gender: PetGender;

  @ApiProperty({
    type: 'string',
    example: PetSize,
  })
  @IsEnum(PetSize)
  size: PetSize;

  @ApiProperty({
    type: 'number',
  })
  @IsNumber()
  adoptionFee: number;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  avatarURL: string;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  neutered: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  vaccinated: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  trained: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  goodWithKids: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  goodWithPets: boolean;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
  })
  @IsObject()
  shelterID: {
    id: string;
    name: string;
    city: string;
    state: string;
    country: string;
  };

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
  })
  @IsObject()
  breed: {
    id: string;
    name: string;
  };

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
  })
  @IsObject()
  species: {
    id: string;
    name: string;
  };

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  createdAt: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  updatedAt: string;
}

export class CreatePetDTO {
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    type: 'string',
    example: PetGender,
  })
  @IsEnum(PetGender)
  @IsNotEmpty()
  gender: PetGender;

  @ApiProperty({
    type: 'string',
    example: PetSize,
  })
  @IsEnum(PetSize)
  @IsNotEmpty()
  size: PetSize;

  @ApiProperty({
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  adoptionFee: number;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  avatarURL: string;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  neutered: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  vaccinated: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  trained: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  goodWithKids: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  goodWithPets: boolean;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  shelterID: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  breedID: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  speciesID: string;
}

export class UpdatePetDTO {
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  age: number;

  @ApiProperty({
    type: 'string',
    example: PetGender,
  })
  @IsEnum(PetGender)
  @IsOptional()
  gender: PetGender;

  @ApiProperty({
    type: 'string',
    example: PetSize,
  })
  @IsEnum(PetSize)
  @IsOptional()
  size: PetSize;

  @ApiProperty({
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  adoptionFee: number;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  avatarURL: string;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  neutered: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  vaccinated: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  trained: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  goodWithKids: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  @IsOptional()
  goodWithPets: boolean;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  shelterID: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  breedID: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  speciesID: string;
}