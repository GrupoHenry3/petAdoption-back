import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDTO, SignInDTO } from '../users/user.dto';

@Injectable()
export class AuthService {
  logger: any;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(payload: { id: string; email: string }) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ googleID: payload.id }, { email: payload.email }] },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          userType: true,
          isActive: true,
          siteAdmin: true,
        },
      });

      return user;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`, error.stack);
    }
  }

  async signIn(payload: SignInDTO) {
    const user = await this.prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      throw new NotFoundException(`${payload.email} not found`);
    }

    const isPasswordValid = await compare(payload.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const jwt = {
      id: user.id,
      userType: user.userType,
      siteAdmin: user.siteAdmin,
      isActive: user.isActive,
    };

    return {
      statusCode: 200,
      token: await this.jwtService.signAsync(jwt),
    };
  }

  async signUp(payload: CreateUserDTO) {
    return await this.usersService.create(payload);
  }

  async googleSignIn(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const jwt = {
      id: user.id,
      userType: user.userType,
      siteAdmin: user.siteAdmin,
      isActive: user.isActive,
    };

    return {
      token: await this.jwtService.signAsync(jwt),
    };
  }

  async validateGoogleUser(payload: CreateUserDTO) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ googleID: payload.googleID }, { email: payload.email }] },
      select: {
        id: true,
        userType: true,
        isActive: true,
        siteAdmin: true,
      },
    });

    if (!user) {
      return await this.usersService.create(payload);
    }

    return user;
  }
}
