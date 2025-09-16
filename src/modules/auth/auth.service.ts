import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../users/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(payload: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) throw new NotFoundException(`${payload.email} not found`);

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
      accessToken: await this.jwtService.signAsync(jwt),
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        siteAdmin: user.siteAdmin,
      },
    };
  }

  async userSignIn(payload: { email: string; password: string }) {
    return this.signIn(payload);
  }

  async signUp(payload: CreateUserDTO) {
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
          fullName: payload.fullName,
          email: payload.email,
          password: hashPassword,
          userType: 'User',
        },
      });

      return {
        statusCode: 201,
        message: 'User created successfully',
      };
    } catch (error: unknown) {
      console.error('Error during user creation:', error);
      return {
        statusCode: 400,
        message: 'Error during user creation',
      };
    }
  }

  async userSignUp(payload: CreateUserDTO) {
    return this.signUp(payload);
  }

  async validateUser(payload: { sub: string; email: string; type: string; site_admin: boolean }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      email: user.email,
      userType: user.userType,
      siteAdmin: user.siteAdmin,
    };
  }

  async validateGoogleUser(payload: {
    sub: string;
    email: string;
    name: string;
    avatarURL?: string;
  }) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ googleID: payload.sub }, { email: payload.email }] },
    });

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

    return user;
  }

  async googleSignIn(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const jwt = {
      sub: user.id,
      email: user.email,
      type: user.userType,
      site_admin: user.siteAdmin,
    };

    return {
      statusCode: 200,
      token: await this.jwtService.signAsync(jwt),
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        siteAdmin: user.siteAdmin,
      },
    };
  }
}
