import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import {
  IsBooleanString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  confirmedPassword: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  googleID?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatarURL?: string;
}

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  avatarURL?: string;
}

export class GetUsersDTO {
  @IsOptional()
  @IsEnum(UserType)
  type?: UserType;

  @IsOptional()
  @IsBooleanString()
  active?: string;

  @IsOptional()
  @IsBooleanString()
  admin?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
