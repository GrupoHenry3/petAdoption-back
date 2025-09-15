import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { toLocalDate } from "src/utils/dateUtils";
import IUser from "./interfaces/user.interface";

@Injectable()
export class UsersService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersRepository: UsersRepository
  ) { }

  // -------------------- CREATE --------------------
  async createUser(newUser: CreateUserDto) {
    // Validar passwords iguales
    if (newUser.password !== newUser.confirmPassword) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Las contraseñas no coinciden',
        detail: 'El campo password y confirmPassword deben ser iguales',
        timestamp: toLocalDate(new Date()),
      });
    }

    // Validar email único
    const existsEmail = await this.usersRepository.getUserByEmail(newUser.email);
    if (existsEmail) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'El email ya está registrado',
        detail: `El email ${newUser.email} ya existe en el sistema`,
        timestamp: toLocalDate(new Date()),
      });
    }
    return this.usersRepository.createUser(newUser);
  }
  // -------------------- CREATE --------------------

  // --------------------- READ ---------------------
  async getUsers() {
    const users = await this.usersRepository.getUsers();
    if (!users || users.length === 0) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No se encontraron usuarios registrados.',
        detail: 'Actualmente no existen registros de usuarios en el sistema.',
        timestamp: toLocalDate(new Date()),
      });
    }
    return users;
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado.',
        detail: `El ID ${id} no corresponde a ningún usuario registrado.`,
        timestamp: toLocalDate(new Date()),
      });
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado.',
        detail: `El EMAIL ${email} no corresponde a ningún usuario registrado.`,
        timestamp: toLocalDate(new Date()),
      });
    }
    return user;
  }
  // --------------------- READ ---------------------

  // -------------------- UPDATE --------------------
  async updateUser(id: string, updateData: UpdateUserDto): Promise<IUser> {
    // Obtener usuario existente
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado',
        detail: `El ID ${id} no corresponde a ningún usuario registrado.`,
        timestamp: toLocalDate(new Date()),
      });
    }
    // Validar password
    if (updateData.password || updateData.confirmPassword) {
      if (updateData.password !== updateData.confirmPassword) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Las contraseñas no coinciden',
          detail: 'El campo password y confirmPassword deben ser iguales',
          timestamp: toLocalDate(new Date()),
        });
      }
    }
    // Eliminar confirmPassword antes de guardar
    if (updateData.confirmPassword) {
      delete updateData.confirmPassword;
    }
    return this.usersRepository.updateUser(id, updateData);
  }
  // -------------------- UPDATE --------------------

  // -------------------- DELETE --------------------
  async deleteUser(id: string): Promise<void> {
    const deleted = await this.usersRepository.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado.',
        detail: `El ID ${id} no corresponde a ningún usuario registrado.`,
        timestamp: toLocalDate(new Date()),
      });
    }
  }
  // -------------------- DELETE --------------------


  // -------------------- STATUS --------------------
  async updateUserStatus(id: string, isActive: boolean): Promise<IUser> {
    // Validar que el usuario exista
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado',
        detail: `El ID ${id} no corresponde a ningún usuario registrado.`,
        timestamp: toLocalDate(new Date()),
      });
    }
    return this.usersRepository.updateUserStatus(id, isActive);
  }
  // -------------------- STATUS --------------------
}