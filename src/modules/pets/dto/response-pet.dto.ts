import { ApiProperty } from '@nestjs/swagger';
import { PetGender, PetSize } from '@prisma/client';

export class PetResponseDto {
  @ApiProperty({ description: 'ID único de la mascota', example: 'uuid-pet-123' })
  id: string;

  @ApiProperty({ description: 'Nombre de la mascota', example: 'Firulais' })
  name: string;

  @ApiProperty({ description: 'Edad en años', example: 3 })
  age: number;

  @ApiProperty({ description: 'Género de la mascota', enum: PetGender })
  gender: PetGender;

  @ApiProperty({ description: 'Tamaño de la mascota', enum: PetSize })
  size: PetSize;

  @ApiProperty({ description: 'Costo de adopción', example: 100 })
  adoptionFee: number;

  @ApiProperty({ description: 'Avatar URL', example: 'https://example.com/dog.png' })
  avatarURL: string;

  @ApiProperty({ description: 'Castrado/neutrado', example: false })
  neutered: boolean;

  @ApiProperty({ description: 'Adoptado o no', example: false })
  isAdopted: boolean;

  @ApiProperty({ description: 'Activo o no', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Fecha de creación', example: '2025-09-19T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Última actualización', example: '2025-09-19T12:30:00Z' })
  updatedAt: Date;

  // Relaciones (solo si querés devolverlas en el response)
  @ApiProperty({ description: 'ID del refugio', example: 'uuid-shelter-123' })
  shelterID: string;

  @ApiProperty({ description: 'ID de la raza', example: 'uuid-breed-456' })
  breedID: string;

  @ApiProperty({ description: 'ID de la especie', example: 'uuid-species-789' })
  speciesID: string;

  @ApiProperty({ description: 'ID de adopción', example: null })
  adoptionID?: string;
}
