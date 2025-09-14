import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDTO } from './types/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Local Auth
  async userSignIn(payload: { email: string; password: string }) {
    // Check if email exists
    const user = await this.prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      throw new NotFoundException(`${payload.email} not found`);
    }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const jwt = {
      sub: user.id,
      email: user.email,
      type: user.userType,
      site_admin: user.siteAdmin,
    };

    return {
      statusCode: 200,
      acessToken: await this.jwtService.signAsync(jwt),
    };
  }

  async userSignUp(payload: UserDTO) {
    try {
      // Check if mail already exists
      const email = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (email) {
        return {
          statusCode: 409,
          message: 'Email already in use',
        };
      }

      const hashPassword = await bcrypt.hash(payload.password, 10);

      await this.prisma.user.create({
        data: {
          email: payload.email,
          password: hashPassword,
        },
      });

      return {
        statusCode: 201,
        message: 'User created successfully',
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: 'Error during user creation',
      };
    }
  }

  // Google Auth
  async validateGoogleUser(payload: {
    sub: string;
    email: string;
    name: string;
    avatarURL?: string;
  }) {
    // Check if google id or email exist
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ googleID: payload.sub }, { email: payload.email }] },
    });

    // If user doesn't exist create new
    if (!user) {
      const hashedPassword = await bcrypt.hash(payload.sub, 10);

      const res = await this.prisma.user.create({
        data: {
          fullName: payload.name,
          email: payload.email,
          password: hashedPassword,
          googleID: payload.sub,
        },
      });

      return res;
    }

    const jwt = {
      sub: user.id,
      email: user.email,
      type: user.userType,
      site_admin: user.siteAdmin,
    };

    return {
      statusCode: 200,
      acessToken: await this.jwtService.signAsync(jwt),
    };
  }
}
