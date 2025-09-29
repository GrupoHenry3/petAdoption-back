import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDTO, SignInDTO } from '../users/user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: { id: true },
    });

    if (!user) throw new NotFoundException('User not found');

    try {
      const res = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          userType: true,
          isActive: true,
          siteAdmin: true,
        },
      });

      return res;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`, error.stack);
    }
  }

  async signIn(payload: SignInDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      throw new NotFoundException(`${payload.email} not found`);
    }

    const isPasswordValid = await compare(payload.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    const jwt = {
      sub: user.id,
      userType: user.userType,
      siteAdmin: user.siteAdmin,
      isActive: user.isActive,
    };

    this.logger.log(`User '${user.fullName}' has logged in`);

    return {
      accessToken: await this.jwtService.signAsync(jwt),
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

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    const jwt = {
      sub: user.id,
      userType: user.userType,
      siteAdmin: user.siteAdmin,
      isActive: user.isActive,
    };

    return {
      accessToken: await this.jwtService.signAsync(jwt),
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
