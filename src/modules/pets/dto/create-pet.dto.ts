import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional, IsEnum, IsUUID, IsUrl } from 'class-validator';
import { PetGender, PetSize } from '@prisma/client';

export class CreatePetDto {
  @ApiProperty({ description: 'Pet name', example: 'Firulais' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Age in years', example: 3 })
  @IsInt()
  age: number;

  @ApiProperty({ description: 'Gender of the pet', enum: PetGender, example: PetGender.Male })
  @IsEnum(PetGender)
  gender: PetGender;

  @ApiProperty({ description: 'pet size', enum: PetSize, example: PetSize.Small })
  @IsEnum(PetSize)
  size: PetSize;

  @ApiProperty({ description: 'Adoption cost', example: 100 })
  @IsInt()
  adoptionFee: number;

  @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/dog.png' })
  @IsUrl()
  avatarURL: string;

  @ApiProperty({
    description: 'Indicates if he is neutered/neutered',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  neutered?: boolean;

  @ApiProperty({ description: 'Indicates if it is adopted', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  isAdopted?: boolean;

  @ApiProperty({ description: 'Active or not in the system', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Associated Shelter ID', example: 'uuid-shelter-123' })
  @IsUUID()
  shelterID: string;

  @ApiProperty({ description: 'breed ID', example: 'uuid-breed-456' })
  @IsUUID()
  breedID: string;

  @ApiProperty({ description: 'species ID', example: 'uuid-species-789' })
  @IsUUID()
  speciesID: string;

  @ApiProperty({ description: 'Adoption ID (optional)', required: false, example: null })
  @IsUUID()
  @IsOptional()
  adoptionID?: string;
}
