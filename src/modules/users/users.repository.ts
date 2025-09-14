import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  // -------------------- CREATE USER --------------------
  async createUser(payload: CreateUserDto) {
    try {
      // Verificar si el username ya existe
      const existingUsername = await this.prisma.user.findUnique({
        where: { username: payload.userName },
      });
      if (existingUsername) {
        throw new ConflictException('Username already in use');
      }

      // Verificar si el email ya existe
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(payload.password, 10);

      // Crear el usuario en la base de datos
      const user = await this.prisma.user.create({
        data: {
          username: payload.userName,
          email: payload.email,
          name: payload.name,
          phoneNumber: payload.phone,
          address: payload.address,
          city: payload.city,
          country: payload.country,
          passwordHash: hashedPassword,
          role: Role.USER, // asigna el rol por defecto
        },
      });

      // Retornar el usuario creado
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error creating user');
    }
  }

  // -------------------- READ USERS --------------------
  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getUserByUserName(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  // -------------------- UPDATE USER --------------------
  async updateUser(id: number, data: Partial<CreateUserDto>) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        passwordHash: data.password
          ? await bcrypt.hash(data.password, 10)
          : undefined,
      },
    });
    return user;
  }

  // -------------------- DELETE USER --------------------
  async deleteUser(id: number) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}























// import { Injectable, NotFoundException } from "@nestjs/common";
// import IUser from "./interfaces/user.interface";
// import { ERole } from "./enum/role.enum";
// import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
// import { PrismaService } from "src/prisma/prisma.service";

// @Injectable()
// export class UsersRepository {
//     constructor(
//       private readonly prisma: PrismaService,

//     ) { }
//   private users: IUser[] = [
//     {
//       id: 1,
//       name: 'César Delgado',
//       email: 'cesar.delgado@example.com',
//       userName: 'cesard',
//       password: 'password123',
//       phone: '+593987654321',
//       address: 'Av. Amazonas 1234',
//       city: 'Quito',
//       country: 'Ecuador',
//       createdAt: new Date('2025-01-15T10:30:00Z'),
//       role: ERole.ADMIN,
//     },
//     {
//       id: 2,
//       name: 'María Pérez',
//       email: 'maria.perez@example.com',
//       userName: 'mariap',
//       password: 'securePass456',
//       phone: '+593998877665',
//       address: 'Calle La Ronda 567',
//       city: 'Quito',
//       country: 'Ecuador',
//       createdAt: new Date('2025-02-20T14:45:00Z'),
//       role: ERole.USER,
//     },
//     {
//       id: 3,
//       name: 'Juan Gómez',
//       email: 'juan.gomez@example.com',
//       userName: 'juang',
//       password: 'myPass789',
//       phone: '+593987112233',
//       address: 'Av. 6 de Diciembre 890',
//       city: 'Quito',
//       country: 'Ecuador',
//       createdAt: new Date('2025-03-05T09:15:00Z'),
//       role: ERole.USER,
//     },
//   ];

//   // -------------------- CREATE --------------------
//   async createUser(newUser: CreateUserDto): Promise<IUser> {
//     const createUser: IUser = {
//       id: this.users.length + 1,
//       name: newUser.name,
//       email: newUser.email,
//       userName: newUser.userName,
//       password: newUser.password,
//       phone: newUser.phone,
//       address: newUser.address,
//       city: newUser.city,
//       country: newUser.country,
//       createdAt: new Date(),
//       role: ERole.USER,
//     };
//     this.users.push(createUser);
//     return createUser;
//   }
//   // -------------------- CREATE --------------------

//   // --------------------- READ ---------------------
//   async getUsers(): Promise<IUser[]> {
//     return this.users;
//   }

//   async getUserById(id: number): Promise<IUser | undefined> {
//     return this.users.find((user) => user.id === id);
//   }

//   async getUserByEmail(email: string): Promise<IUser | undefined> {
//     return this.users.find((user) => user.email === email);
//   }

//   async getUserByUserName(userName: string): Promise<IUser | undefined> {
//     return this.users.find((user) => user.userName === userName);
//   }
//   // --------------------- READ ---------------------

//   // -------------------- UPDATE --------------------
//   async updateUser(id: number, updateData: UpdateUserDto): Promise<IUser> {
//     const userIndex = this.users.findIndex((user) => user.id === id);
//     const updatedUser: IUser = {
//       ...this.users[userIndex],
//       ...updateData,
//     };
//     this.users[userIndex] = updatedUser;
//     return updatedUser;
//   }
//   // -------------------- UPDATE --------------------

//   // -------------------- DELETE --------------------
//   async deleteUser(id: number): Promise<boolean> {
//     const originalCount = this.users.length;
//     this.users = this.users.filter((user) => user.id !== id);
//     return this.users.length < originalCount; // true si eliminó, false si no encontró
//   }
//   // -------------------- DELETE --------------------
// }

















//   @Column({ type: 'boolean', default: false })
//   isAdmin: boolean;

//   @OneToMany(() => Order, (order) => order.user)
//   orders: Order[]

//   @Column({ default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date;

//   @Column({
//     type: 'simple-enum',
//     enum: ERole,
//     default: ERole.USER
//   })
//   role: ERole;
// };