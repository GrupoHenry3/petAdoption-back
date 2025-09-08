import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OrgDTO, UserDTO } from './types/user';
import { Organization } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Users
  async userSignIn(payload: { email: string; password: string }) {
    // Check if email exists
    const existingUser = await this.prisma.user.findUnique({ where: { email: payload.email } });

    if (!existingUser) {
      throw new ConflictException(`${payload.email} not found`);
    }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(payload.password, existingUser.passwordHash);

    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    const jwt = {
      sub: existingUser.id,
      email: existingUser.email,
    };

    return {
      statusCode: 200,
      user: {
        id: existingUser.id,
        username: existingUser.username,
        token: await this.jwtService.signAsync(jwt),
      },
    };
  }

  async userSignUp(payload: UserDTO) {
    try {
      // Check if user / mail already exists
      const username = await this.prisma.user.findUnique({
        where: { username: payload.username },
      });

      const email = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (username) {
        return {
          statusCode: 409,
          message: 'Username already in use',
        };
      }

      if (email) {
        return {
          statusCode: 409,
          message: 'Email already in use',
        };
      }

      const hashPassword = await bcrypt.hash(payload.password, 10);

      const user = await this.prisma.user.create({
        data: {
          username: payload.username,
          email: payload.email,
          passwordHash: hashPassword,
        },
      });

      return {
        statusCode: 201,
        message: 'User created successfully. Please check your email for verification',
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: 'Error during user creation',
      };
    }
  }

  // Organizations
  async orgSignIn(payload: { email: string; password: string }) {
    // Check if email exists
    const existingOrg = await this.prisma.organization.findUnique({
      where: { email: payload.email },
    });

    if (!existingOrg) {
      throw new ConflictException(`${payload.email} not found`);
    }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(payload.password, existingOrg.passwordHash);

    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    const jwt = {
      sub: existingOrg.id,
      email: existingOrg.email,
    };

    return {
      statusCode: 200,
      user: {
        id: existingOrg.id,
        username: existingOrg.name,
        token: await this.jwtService.signAsync(jwt),
      },
    };
  }

  async orgSignUp(payload: OrgDTO) {
    try {
      // Check if mail already exists
      const email = await this.prisma.organization.findUnique({
        where: { email: payload.email },
      });

      if (email) {
        return {
          statusCode: 409,
          message: 'Email already in use',
        };
      }

      const hashPassword = await bcrypt.hash(payload.password, 10);

      const user = await this.prisma.organization.create({
        data: {
          name: payload.name,
          email: payload.email,
          passwordHash: hashPassword,
        },
      });

      return {
        statusCode: 201,
        message: 'Organization created successfully. Please check your email for verification',
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: 'Error during organization creation',
      };
    }
  }
}
