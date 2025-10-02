import { ApiProperty } from '@nestjs/swagger';
import { DonationStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class Donation {
  @ApiProperty({
    type: 'string',
  })
  @IsNumber()
  id: string;

  @ApiProperty({
    type: 'number',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  message: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  sessionID: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  shelterID: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  userID: string;

  @ApiProperty({
    type: 'string',
    example: DonationStatus,
  })
  @IsEnum(DonationStatus)
  status: DonationStatus;

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

export class DonationDTO {
  @ApiProperty({
    type: 'number',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  shelterID: string;

  @ApiProperty({
    type: 'string',
    example: DonationStatus,
  })
  @IsEnum(DonationStatus)
  status: DonationStatus;
}
