import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BreedDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  avatarURL: string;

  @IsString()
  @IsNotEmpty()
  speciesID: string;
}

export class UpdateBreedDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  avatarURL?: string;

  @IsString()
  @IsOptional()
  speciesID?: string;
}
