import { IsNotEmpty, IsString } from 'class-validator';

export class SpeciesDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
