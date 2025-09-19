import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DonationDTO {
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsNotEmpty()
  userID: string;

  @IsString()
  @IsNotEmpty()
  shelterID: string;
}
