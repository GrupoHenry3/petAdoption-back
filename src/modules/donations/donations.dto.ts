import { donationStatus } from '@prisma/client';
import { IsEnum, isEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsEnum(donationStatus)
  status: donationStatus;

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

  @IsEnum(donationStatus)
  status: donationStatus;
}
