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
      throw new ConflictException('Passwords do not match');
    }

    const isEmailValid = await this.prisma.user.findUnique({
      where: { email: payload.email },
      select: { email: true },
    });

    if (isEmailValid) {
      throw new ConflictException('Email alredy in use');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const newUser = {
      fullName: payload.fullName,
      email: payload.email,
      password: passwordHash,
      googleID: payload.googleID,
      avatarURL:
        payload.avatarURL ??
        'https://res.cloudinary.com/dbngufqmd/image/upload/v1757395194/blank_xpjfv8.webp',
    };

    try {
      const user = await this.prisma.user.create({ data: newUser });

      this.logger.log('User created successfully');
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        user: {
          id: user.id,
          createAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
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
          id: true,
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
          id: true,
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

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email: email } });
  }
}
