import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Shelter {
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
    type: 'string',
  })
  @IsString()
  country: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  state: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  city: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  address: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  website: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  description: string;
}

export class ShelterDTO {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  country: string;
}

export class UpdateShelterDTO {
  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class GetSheltersDTO {
  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsOptional()
  @IsString()
  city?: string;
}
