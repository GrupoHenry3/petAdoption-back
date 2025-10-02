import { All } from '@nestjs/common';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import {
  Allow,
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

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  googleID?: string;

  @ApiHideProperty()
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

export class SignInDTO {
  @ApiProperty({ example: 'mail@example.com' })
  @Allow()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'mypassword123' })
  @Allow()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string;
}
