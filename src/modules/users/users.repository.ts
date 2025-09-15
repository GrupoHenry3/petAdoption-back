import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import IUser from "./interfaces/user.interface";
import { EUserType } from "./enum/userType.enum";
import * as bcrypt from "bcrypt";
import { toLocalDate } from "src/utils/dateUtils";
import { UserType } from "@prisma/client";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  // -------------------- CREATE --------------------
  async createUser(newUser: CreateUserDto): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: newUser.email,
        password: hashedPassword,
        googleID: newUser.googleID ?? null,
        phone: newUser.phone ?? null,
        fullName: newUser.fullName ?? null,
        address: newUser.address ?? null,
        city: newUser.city ?? null,
        country: newUser.country ?? null,
        avatarURL: "https://cdn-icons-png.flaticon.com/512/1361/1361728.png",
        userType: UserType.USER,
        siteAdmin: false,
        isActive: true,
      },
    });

    return this.toIUser(user);
  }
  // -------------------- CREATE --------------------

  // --------------------- READ ---------------------
  async getUsers(): Promise<IUser[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => this.toIUser(u));
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toIUser(user) : null;
  }

  async getUserByEmail(email: string): Promise<IUser | undefined> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toIUser(user) : undefined;
  }
  // --------------------- READ ---------------------

  // -------------------- UPDATE --------------------
  async updateUser(id: string, updateData: UpdateUserDto): Promise<IUser> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    let data: any = { ...updateData };

    // Hash password si se envía
    if (updateData.password) {
      data.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.toIUser(updated);
  }
  // -------------------- UPDATE --------------------

  // -------------------- DELETE --------------------
  async deleteUser(id: string): Promise<boolean> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) return false;

    await this.prisma.user.delete({ where: { id } });
    return true;
  }
  // -------------------- DELETE --------------------

  // -------------------- STATUS --------------------
  async updateUserStatus(id: string, isActive: boolean): Promise<IUser> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive },
    });
    return this.toIUser(updated);
  }
  // -------------------- STATUS --------------------

  // -------------------- MAPPER --------------------
  private toIUser(user: any): IUser {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      googleID: user.googleID,
      phone: user.phone,
      fullName: user.fullName,
      address: user.address,
      city: user.city,
      country: user.country,
      avatarURL: user.avatarURL,
      userType: user.userType as EUserType, // Prisma → enum local
      siteAdmin: user.siteAdmin,
      isActive: user.isActive,
      createdAt: toLocalDate(user.createdAt),
      updatedAt: toLocalDate(user.updatedAt),
    };
  }
}









// import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
// import IUser from "./interfaces/user.interface";
// import { EUserType } from "./enum/userType.enum";
// import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
// import { PrismaService } from "src/prisma/prisma.service";
// import { v4 as uuidv4 } from "uuid";
// import * as bcrypt from "bcrypt";
// import { isUUID } from "class-validator";
// import { toLocalDate } from "src/utils/dateUtils";

// @Injectable()
// export class UsersRepository {
//   constructor(private readonly prisma: PrismaService) { }

//   private users: IUser[] = [
//     {
//       id: "550e8400-e29b-41d4-a716-446655440000",
//       email: "maria.gomez@example.com",
//       password: "$2b$10$4nccwNG7s0tvwUqjJKkXmOXWe/04JXJ.auXhxYMcX5MJuvRCpkgnq",
//       googleID: "google-123456",
//       phone: "+593987654321",
//       fullName: "María Gómez",
//       address: "Calle Falsa 456",
//       city: "Guayaquil",
//       country: "Ecuador",
//       avatarURL: "https://cdn-icons-png.flaticon.com/512/1361/1361729.png",
//       userType: EUserType.USER,
//       siteAdmin: false,
//       isActive: true,
//       createdAt: toLocalDate(new Date("2024-08-15T18:58:04.025Z")),
//       updatedAt: toLocalDate(new Date("2024-09-13T10:45:06.025Z"))
//     },
//     {
//       id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//       email: "carlos.lopez@example.com",
//       password: "$2b$10$4nccwNG7s0tvwUqjJKkXmOXWe/04JXJ.auXhxYMcX5MJuvRCpkgnq",
//       googleID: "google-234567",
//       phone: "+593999888777",
//       fullName: "Carlos López",
//       address: "Av. Libertad 789",
//       city: "Cuenca",
//       country: "Ecuador",
//       avatarURL: "https://cdn-icons-png.flaticon.com/512/1361/1361730.png",
//       userType: EUserType.USER,
//       siteAdmin: false,
//       isActive: true,
//       createdAt: toLocalDate(new Date("2025-09-10T20:34:02.025Z")),
//       updatedAt: toLocalDate(new Date("2025-09-12T18:58:04.025Z"))
//     },
//     {
//       id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
//       email: "ana.martinez@example.com",
//       password: "$2b$10$4nccwNG7s0tvwUqjJKkXmOXWe/04JXJ.auXhxYMcX5MJuvRCpkgnq",
//       googleID: "google-345678",
//       phone: "+593976543210",
//       fullName: "Ana Martínez",
//       address: "Boulevard Central 101",
//       city: "Ambato",
//       country: "Ecuador",
//       avatarURL: "https://cdn-icons-png.flaticon.com/512/1361/1361731.png",
//       userType: EUserType.USER,
//       siteAdmin: false,
//       isActive: true,
//       createdAt: toLocalDate(new Date("2025-03-17T11:13:07.025Z")),
//       updatedAt: toLocalDate(new Date("2025-05-14T13:18:04.025Z"))
//     }
//   ]; // Inicialmente vacío o con seed

//   // -------------------- CREATE --------------------
//   async createUser(newUser: CreateUserDto): Promise<IUser> {
//     const hashedPassword = await bcrypt.hash(newUser.password, 10);
//     const user: IUser = {
//       id: uuidv4(),
//       email: newUser.email,
//       password: hashedPassword,
//       googleID: newUser.googleID ?? null,
//       phone: newUser.phone ?? null,
//       fullName: newUser.fullName ?? null,
//       address: newUser.address ?? null,
//       city: newUser.city ?? null,
//       country: newUser.country ?? null,
//       avatarURL: "https://cdn-icons-png.flaticon.com/512/1361/1361728.png",
//       userType: EUserType.USER,
//       siteAdmin: false,
//       isActive: true,
//       createdAt: toLocalDate(new Date()),
//       updatedAt: toLocalDate(new Date()),
//     };
//     this.users.push(user);
//     return user;
//   }
//   // -------------------- CREATE --------------------

//   // --------------------- READ ---------------------
//   async getUsers(): Promise<IUser[]> {
//     return this.users;
//   }

//   async getUserById(id: string): Promise<IUser | null> {
//     const user = this.users.find((user) => user.id === id);
//     if (!user) {
//       return null; // El service se encarga de lanzar NotFoundException
//     }
//     return user;
//   }

//   async getUserByEmail(email: string): Promise<IUser | undefined> {
//     return this.users.find((user) => user.email === email);
//   }
//   // --------------------- READ ---------------------

//   // -------------------- UPDATE --------------------
//   async updateUser(id: string, updateData: UpdateUserDto): Promise<IUser> {
//     const userIndex = this.users.findIndex((user) => user.id === id);
//     if (userIndex === -1) {
//       throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
//     }
//     // Si se actualiza la contraseña, hashearla
//     if (updateData.password) {
//       updateData.password = await bcrypt.hash(updateData.password, 10);
//     }
//     // Solo actualizar campos definidos (evita sobreescribir con undefined)
//     const updatedUser: IUser = {
//       ...this.users[userIndex],
//       ...Object.fromEntries(
//         Object.entries(updateData).filter(([_, value]) => value !== undefined)
//       ),
//       updatedAt: new Date(),
//     };
//     this.users[userIndex] = updatedUser;
//     return updatedUser;
//   }
//   // -------------------- UPDATE --------------------

//   // -------------------- DELETE --------------------
//   async deleteUser(id: string): Promise<boolean> {
//     const originalCount = this.users.length;
//     this.users = this.users.filter((user) => user.id !== id);
//     return this.users.length < originalCount;
//   }
//   // -------------------- DELETE --------------------

//   // -------------------- STATUS --------------------
//   async updateUserStatus(id: string, isActive: boolean): Promise<IUser> {
//     const userIndex = this.users.findIndex(user => user.id === id);
//     if (userIndex === -1) {
//       throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
//     }
//     // Actualizar status
//     this.users[userIndex].isActive = isActive;
//     // Actualizar fecha de modificación a hora local
//     this.users[userIndex].updatedAt = toLocalDate(new Date());
//     return this.users[userIndex];
//   }
//   // -------------------- STATUS --------------------
// }