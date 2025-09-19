import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { CreateUserDTO, SignInDTO } from '../users/user.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() payload: CreateUserDTO) {
    return await this.authService.signUp(payload);
  }

  @Post('signin')
  @HttpCode(HttpStatus.ACCEPTED)
  async signIn(@Res({ passthrough: true }) res: Response, @Body() payload: SignInDTO) {
    const result = await this.authService.signIn(payload);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');

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
  async googleCallback(@Req() req, @Res() res) {
    const result = await this.authService.googleSignIn(req.user.user.id);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    res.redirect(`${process.env.FRONTEND_URL}`);
  }
}
