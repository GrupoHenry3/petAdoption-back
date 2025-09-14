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
import { UserDTO } from './types/user';
import { GoogleAuthGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.ACCEPTED)
  userSignIn(@Body() payload: { email: string; password: string }) {
    return this.authService.userSignIn(payload);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  userSignUp(@Body() payload: UserDTO) {
    return this.authService.userSignUp(payload);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCB(@Req() req, @Res() res) {
    console.log(req.user);
  }
}
