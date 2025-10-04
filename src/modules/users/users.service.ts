import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, GetUsersDTO, UpdateUserDTO } from './user.dto';
import { Prisma } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(payload: CreateUserDTO) {
    if (payload.password !== payload.confirmedPassword) {
      throw new ConflictException('Passwords do not match');
    }

    const isEmailValid = await this.prisma.user.findUnique({
      where: { email: payload.email },
      select: { email: true },
    });

    if (isEmailValid) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const newUser = {
      fullName: payload.fullName,
      email: payload.email,
      password: passwordHash,
      googleID: payload.googleID,
      avatarURL:
        payload.avatarURL ||
        'https://res.cloudinary.com/dbngufqmd/image/upload/v1757395194/blank_xpjfv8.webp',
    };

    try {
      const user = await this.prisma.user.create({
        data: newUser,
        omit: {
          googleID: true,
          password: true,
        },
      });

      this.logger.log('User created successfully');

      await this.mailService.signUpConfirmation(user.fullName, user.email);

      return {
        id: user.id,
        createAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new InternalServerErrorException('An unexpected error occurred during user creation');
    }
  }

  async update(userId: string, payload: UpdateUserDTO) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { ...payload },
        omit: {
          password: true,
          googleID: true,
        },
      });

      this.logger.log(`Successfully updated user: ${userId}`);

      return user;
    } catch (error) {
      this.logger.error(`Failed to update user: ${userId}`, error);
      throw new BadRequestException('An error has ocurred');
    }
  }

  async updateUserStatus(userId: string) {
    const isUserValid = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!isUserValid) {
      throw new NotFoundException('User not found');
    }

    const userStatus = !isUserValid.isActive;

    try {
      await this.prisma.user.update({
        where: { id: isUserValid.id },
        data: {
          isActive: userStatus,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update status for user: ${userId}`, error);
      throw new BadRequestException('An error has ocurred');
    }
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: { id: true },
    });

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
        omit: {
          password: true,
          googleID: true,
        },
        include: {
          adoptions: {
            select: {
              id: true,
              pet: {
                select: {
                  id: true,
                  name: true,
                },
              },
              shelter: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      this.logger.log('Fetched data for all users');

      return users;
    } catch (error) {
      this.logger.error(`Failed to fetch data for all users`, error);
      throw new BadRequestException('An error has ocurred');
    }
  }

  async findOne(userId: string) {
    const isUserValid = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!isUserValid) {
      throw new NotFoundException(`User not found`);
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        omit: {
          password: true,
          googleID: true,
        },
        include: {
          adoptions: {
            select: {
              id: true,
              status: true,
              pet: {
                select: {
                  id: true,
                  name: true,
                  avatarURL: true,
                },
              },
              shelter: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          shelter: {
            select: {
              id: true,
              name: true,
              country: true,
              state: true,
              city: true,
              address: true,
              phoneNumber: true,
              website: true,
              description: true,
              createdAt: true,
            },
          },
        },
      });

      this.logger.log(`Fetched data for user ${userId}`);

      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch data for user: ${userId}`, error);
      throw new BadRequestException('An error has ocurred');
    }
  }

  async findCurrentUser(userId: string) {
    const isUserValid = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!isUserValid) {
      throw new NotFoundException(`User not found`);
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        omit: {
          password: true,
          googleID: true,
        },
        include: {
          adoptions: {
            include: {
              pet: {
                select: {
                  id: true,
                  name: true,
                  age: true,
                  gender: true,
                  size: true,
                  avatarURL: true,
                  breed: {
                    select: {
                      name: true,
                    },
                  },
                  species: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              shelter: {
                select: {
                  id: true,
                  name: true,
                  city: true,
                  state: true,
                  country: true,
                },
              },
            },
          },
          favoritePets: true,
          shelter: {
            omit: {
              userID: true,
            },
          },
        },
      });

      this.logger.log(`Fetched data for user: ${userId}`);

      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch data for user: ${userId}`, error);
      throw new InternalServerErrorException('An error occurred while fetching user information');
    }
  }
}
