import { ApiProperty } from '@nestjs/swagger';

export class ResponsePetDto {
  @ApiProperty({ example: 'pet_cuid_123' })
  id: string;

  @ApiProperty({ example: 'Firulais' })
  name: string;

  @ApiProperty({ example: 'Firulais' })
  image_url: string;

  // @ApiProperty({ example: 3 })
  // age: number;

  // @ApiProperty({ enum: PetGender, example: PetGender.Male })
  // gender: PetGender;

  // @ApiProperty({ enum: PetSize, example: PetSize.Small })
  // size: PetSize;

  // @ApiProperty({ example: 2000 })
  // adoptionFee: number;

  // @ApiProperty({ example: false })
  // isAdopted: boolean;

  // @ApiProperty({ example: true })
  // isActive: boolean;

  // @ApiProperty({ example: '2025-09-13T15:00:00.000Z' })
  // createdAt: Date;

  // @ApiProperty({ example: '2025-09-13T15:05:00.000Z' })
  // updatedAt: Date;

  // @ApiProperty({ example: 'shelter_cuid_123' })
  // shelterID: string;

  // @ApiProperty({ example: 'breed_cuid_456' })
  // breedID: string;

  // @ApiProperty({ example: 'species_cuid_789' })
  // speciesID: string;

  // @ApiProperty({ example: 'adoption_cuid_101', required: false })
  // adoptionID?: string;
}
