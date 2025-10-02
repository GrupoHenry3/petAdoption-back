import { DonationStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class Donation {
  @IsNumber()
  id: string;

  @IsString()
  message: string;

  @IsString()
  sessionID: string;

  @IsString()
  shelterID: string;

  @IsString()
  userID: string;

  @IsEnum(DonationStatus)
  status: DonationStatus;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

export class DonationDTO {
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsNotEmpty()
  shelterID: string;

  @IsEnum(DonationStatus)
  status: DonationStatus;
}
