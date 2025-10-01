import { IsNotEmpty, IsString } from 'class-validator';

export class Species {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

export class SpeciesDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
