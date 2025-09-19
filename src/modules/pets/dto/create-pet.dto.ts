import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { PetGender, PetSize } from '@prisma/client';

export class CreatePetDto {
  @ApiProperty({ example: 'Firulais' })
  @IsString()
  name: string;

  @ApiProperty({ example: 3 })
  @IsInt()
  age: number;

  @ApiProperty({ enum: PetGender, example: PetGender.Male })
  @IsEnum(PetGender)
  gender: PetGender;

  @ApiProperty({ enum: PetSize, example: PetSize.Small })
  @IsEnum(PetSize)
  size: PetSize;

  @ApiProperty({ example: 2000 })
  @IsInt()
  adoptionFee: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isAdopted?: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 'shelter_cuid_123' })
  @IsString()
  shelterID: string;

  @ApiProperty({ example: 'breed_cuid_456' })
  @IsString()
  breedID: string;

  @ApiProperty({ example: 'species_cuid_789' })
  @IsString()
  speciesID: string;

  @ApiProperty({ example: 'adoption_cuid_101', required: false })
  @IsString()
  @IsOptional()
  adoptionID?: string;
}
