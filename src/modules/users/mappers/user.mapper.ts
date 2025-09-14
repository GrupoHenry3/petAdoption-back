import { ResponseUserDto } from "../dto/response-user.dto";
import { ResponseUserAdminDto } from "../dto/response-userAdmin.dto";
import IUser from "../interfaces/user.interface";

export function toResponseUserAdminDto(user): ResponseUserAdminDto {
  return {
    ...user,
    createdAt: user.createdAt instanceof Date
      ? user.createdAt.toISOString()
      : user.createdAt,
  };
}

export function toResponseUserDto(user): ResponseUserDto {
  return {
    ...user,
    createdAt: user.createdAt instanceof Date 
      ? user.createdAt.toISOString()
      : user.createdAt,
  };
}