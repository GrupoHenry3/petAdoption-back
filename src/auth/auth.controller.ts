import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './types/user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.ACCEPTED)
  signin(@Body() payload: { email: string; password: string }) {
    return this.authService.signIn(payload);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() payload: UserDTO) {
    return this.authService.signUp(payload);
  }
}
