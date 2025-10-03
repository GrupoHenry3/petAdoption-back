import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Res,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { CreateUserDTO, SignInDTO } from '../users/user.dto';
import { ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    schema: {
      properties: {
        fullName: { type: 'string', example: 'Alice' },
        email: { type: 'string', example: 'name@example.com' },
        password: { type: 'string', example: 'mypassword123' },
        confirmedPassword: { type: 'string', example: 'mypassword123' },
      },
      required: ['fullName', 'email', 'password', 'confirmedPassword'],
    },
  })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() payload: CreateUserDTO) {
    const result = await this.authService.signUp(payload);
    return result;
  }

  @Post('signin')
  @HttpCode(HttpStatus.ACCEPTED)
  async signIn(@Body() payload: SignInDTO) {
    const result = await this.authService.signIn(payload);
    
    return {
      statusCode: 202,
      message: 'Login successful',
      accessToken: result.accessToken,
    };
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signOut() {
    return {
      statusCode: 200,
      message: 'Logged out successfully',
    };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res: Response) {
    try {
      const result = await this.authService.googleSignIn(req.user.id);
      
      // Redirigir al frontend con el token en la URL
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.accessToken}`);
    } catch (e) {
      this.logger.error(e);
      res.redirect(`${process.env.FRONTEND_URL}/auth?error=oauth_failed`);
    }
  }
}
