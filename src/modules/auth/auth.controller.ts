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
import { CreateUserDTO } from '../users/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.ACCEPTED)
  async signIn(@Body() payload: { email: string; password: string }) {
    return this.authService.signIn(payload);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() payload: CreateUserDTO) {
    return this.authService.signUp(payload);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.googleSignIn(req.user.user.id);
    res.redirect(`${process.env.FRONTEND_URL}/?token=${response.token}`);
  }
}
