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
import type { Response } from 'express';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
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
  async signIn(@Res({ passthrough: true }) res: Response, @Body() payload: SignInDTO) {
    const result = await this.authService.signIn(payload);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return {
      statusCode: 202,
      message: 'Login successful',
      accessToken: result.accessToken,
    };
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signOut(@Res({ passthrough: true }) res: Response) {
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
  async googleCallback(@Req() req, @Res() res: Response) {
    try {
      console.log('Google OAuth callback - User ID:', req.user.id);
      console.log('Google OAuth callback - User object:', req.user);
      
      const result = await this.authService.googleSignIn(req.user.id);
      console.log('Google OAuth callback - JWT generated:', !!result.accessToken);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
        maxAge: 60 * 60 * 1000,
      };
      
      console.log('Google OAuth callback - Cookie options:', cookieOptions);
      res.cookie('access_token', result.accessToken, cookieOptions);

      console.log('Google OAuth callback - Cookie set, redirecting to:', process.env.FRONTEND_URL);
      res.redirect(`${process.env.FRONTEND_URL}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/auth?error=oauth_failed`);
    }
  }
}
