import { IsEmail, IsOptional, IsString, IsBoolean, IsIn, IsEnum, Matches, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'Debe confirmar la contraseña' })
  confirmPassword: string;

  @IsOptional()
  @IsString()
  googleID?: string | null;

  @IsOptional()
  @IsString()
  fullName?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{7,15}$/, { message: 'phone must be a valid number with optional + and 7-15 digits' })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsString()
  city?: string | null;

  @IsOptional()
  @IsString()
  country?: string | null;
}