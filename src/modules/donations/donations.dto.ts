import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
}
