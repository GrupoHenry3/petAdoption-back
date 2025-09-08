import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OrgDTO, UserDTO } from './types/user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/signin')
  @HttpCode(HttpStatus.ACCEPTED)
  userSignIn(@Body() payload: { email: string; password: string }) {
    return this.authService.userSignIn(payload);
  }

  @Post('user/signup')
  @HttpCode(HttpStatus.CREATED)
  userSignUp(@Body() payload: UserDTO) {
    return this.authService.userSignUp(payload);
  }

  @Post('org/signin')
  @HttpCode(HttpStatus.ACCEPTED)
  orgSignIn(@Body() payload: { email: string; password: string }) {
    return this.authService.orgSignIn(payload);
  }

  @Post('org/signup')
  @HttpCode(HttpStatus.CREATED)
  orgSignUn(@Body() payload: OrgDTO) {
    return this.authService.orgSignUp(payload);
  }
}
