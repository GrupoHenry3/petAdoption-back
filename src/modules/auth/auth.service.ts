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

    if (!user) {
      throw new NotFoundException('User not found');
    }

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

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    const isPasswordValid = await compare(payload.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
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
    console.log('GoogleSignIn - Looking for user with ID:', id);
    
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    console.log('GoogleSignIn - User found:', !!user);

    if (!user) {
      console.log('GoogleSignIn - User not found');
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      console.log('GoogleSignIn - User is inactive');
      throw new UnauthorizedException('User is inactive');
    }

    const jwt = {
      sub: user.id,
      userType: user.userType,
      siteAdmin: user.siteAdmin,
      isActive: user.isActive,
    };

    console.log('GoogleSignIn - JWT payload:', jwt);
    const accessToken = await this.jwtService.signAsync(jwt);
    console.log('GoogleSignIn - JWT generated successfully');

    return {
      accessToken,
    };
  }

  async validateGoogleUser(payload: CreateUserDTO) {
    console.log('ValidateGoogleUser - Payload:', payload);
    
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ googleID: payload.googleID }, { email: payload.email }] },
      select: {
        id: true,
        userType: true,
        isActive: true,
        siteAdmin: true,
        googleID: true,
      },
    });

    console.log('ValidateGoogleUser - User found:', !!user);

    if (!user) {
      console.log('ValidateGoogleUser - Creating new user');
      // Usuario nuevo - crear cuenta
      const newUser = await this.usersService.create(payload);
      console.log('ValidateGoogleUser - New user created:', newUser);
      return newUser;
    }

    console.log('ValidateGoogleUser - Existing user found:', user);
    
    // Usuario existente - actualizar googleID si no lo tiene
    if (!user.googleID) {
      console.log('ValidateGoogleUser - Updating googleID for existing user');
      await this.prisma.user.update({
        where: { id: user.id },
        data: { googleID: payload.googleID },
      });
    }

    return user;
  }
}
