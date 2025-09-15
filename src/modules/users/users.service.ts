import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, GetUsersDTO, UpdateUserDTO } from './user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateUserDTO) {
    if (payload.password !== payload.confirmedPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const isEmailValid = await this.prisma.user.findUnique({
      where: { email: payload.email },
      select: { email: true },
    });

    if (isEmailValid) {
      throw new ConflictException('Email alredy in use');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user = {
      email: payload.email,
      password: passwordHash,
    };

    try {
      await this.prisma.user.create({ data: user });

      this.logger.log('User created successfully');
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
      };
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('An unexpected error occurred during user creation');
    }
  }

  async update(id: string, payload: UpdateUserDTO) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: id },
        data: { ...payload },
        select: {
          email: true,
          fullName: true,
          country: true,
          city: true,
          address: true,
          phoneNumber: true,
          avatarURL: true,
          userType: true,
          siteAdmin: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log(`Successfully updated user ${id}`);

      return user;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new BadRequestException('An error has ocurred');
    }
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id }, select: { id: true } });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: { isActive: false },
    });

    return {
      id: updatedUser.id,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async findAll(filters: GetUsersDTO) {
    const where: Prisma.UserWhereInput = {};

    if (filters.active !== undefined) {
      where.isActive = filters.active === 'true';
    }

    if (filters.admin !== undefined) {
      where.siteAdmin = filters.admin === 'true';
    }

    if (filters.type) {
      where.userType = filters.type;
    }

    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    try {
      const users = await this.prisma.user.findMany({
        where: where,
        select: {
          email: true,
          fullName: true,
          country: true,
          city: true,
          address: true,
          phoneNumber: true,
          avatarURL: true,
          userType: true,
          siteAdmin: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log('Fetched information of all users');

      return users;
    } catch (error) {
      this.logger.error(`Error fetching users: ${error.message}`, error.stack);
    }
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id }, select: { id: true } });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id },
        select: {
          email: true,
          fullName: true,
          country: true,
          city: true,
          address: true,
          phoneNumber: true,
          avatarURL: true,
          userType: true,
          siteAdmin: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          adoptions: true,
          favoritePets: true,
        },
      });

      this.logger.log(`Fetched information for user ${id}`);

      return user;
    } catch (error) {
      this.logger.error(`Error fetching user: ${error.message}`, error.stack);
    }
  }

  // async findUserAdoptions(id: string) {
  //   const user = await this.prisma.user.findUnique({ where: { id: id }, select: { id: true } });

  //   if (!user) {
  //     throw new NotFoundException(`User not found`);
  //   }

  //   try {
  //     return await this.prisma.adoption.findMany({ where: { userID: id } });
  //   } catch (error) {
  //     this.logger.error(`Error fetching adoptions for user: ${id}, ${error.message}`, error.stack);
  //   }
  // }
}
