<<<<<<< Updated upstream
import { Injectable } from '@nestjs/common';
=======
import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersRepository } from './users.repository';
// import IUser from './interfaces/user.interface';
>>>>>>> Stashed changes
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
<<<<<<< Updated upstream
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
=======
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersRepository: UsersRepository
  ) { }

  // -------------------- CREATE --------------------
  async createUser(newUser: CreateUserDto) {
    // Validar password == confirmPassword
    if (newUser.password !== newUser.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Validar email único
    const existsEmail = await this.usersRepository.getUserByEmail(newUser.email);
    if (existsEmail) {
      throw new ConflictException('Email already exists');
    }

    // Validar username único
    const existsUserName = await this.usersRepository.getUserByUserName(newUser.userName);
    if (existsUserName) {
      throw new ConflictException('Username already exists');
    }

    return this.usersRepository.createUser(newUser);
  }
  // -------------------- CREATE --------------------

  // --------------------- READ ---------------------
  async getUsers() {
    const users = await this.usersRepository.getUsers();
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }


  async getUserById(id: number) {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado.',
        detail: `El ID ${id} no corresponde a ningún usuario registrado.`,
        timestamp: new Date().toISOString(),
      });
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado.',
        detail: `El EMAIL ${email} no corresponde a ningún usuario registrado.`,
        timestamp: new Date().toISOString(),
      });
    }
    return user;
>>>>>>> Stashed changes
  }

  async getUserByUserName(userName: string) {
    const user = await this.usersRepository.getUserByUserName(userName);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado.',
        detail: `El USERNAME ${userName} no corresponde a ningún usuario registrado.`,
        timestamp: new Date().toISOString(),
      });
    }
    return user;
  }
  // --------------------- READ ---------------------

  // -------------------- UPDATE --------------------
  async updateUser(id: number, updateData: UpdateUserDto) {
    // Obtener el usuario existente
    const user = await this.usersRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado',
        detail: `El ID ${id} no corresponde a ningún usuario registrado.`,
        timestamp: new Date().toISOString(),
      });
    }

    // Validar password si se quiere actualizar
    if (updateData.password || updateData.confirmPassword) {
      if (updateData.password !== updateData.confirmPassword) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Las contraseñas no coinciden',
          detail: 'El campo password y confirmPassword deben ser iguales',
          timestamp: new Date().toISOString(),
        });
      }
    }
    // Eliminar confirmPassword antes de guardar, no lo almacenamos
    if (updateData.confirmPassword) {
      delete updateData.confirmPassword;
    }
    // Actualizar el usuario
    return this.usersRepository.updateUser(id, updateData);
  }
  // -------------------- UPDATE --------------------

  // -------------------- DELETE --------------------
  async deleteUser(id: number): Promise<void> {
    const deleted = await this.usersRepository.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado.',
        detail: `El ID ${id} no corresponde a ningún usuario registrado.`,
        timestamp: new Date().toISOString(),
      });
    }
  }
  // -------------------- DELETE --------------------













//   async findAll() {
//     const users = await this.prisma.user.findMany({
//       select: {
//         id: true,
//         username: true,
//         name: true,
//         email: true,
//       },
//     });

//     return users;
//   }

//   async findOne(id: number) {
//     return this.prisma.user.findUnique({
//       where: { id },
//       select: {
//         id: true,
//         username: true,
//         name: true,
//         phoneNumber: true,
//         email: true,
//         adoptions: true
//       },
//     });
//   }

//   async deleteOne(id: number) {
//     return this.prisma.user.delete({ where: { id } });
//   }
}
