import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

export interface JwtPayload {
  id: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.JWT_SECRET_TOKEN}`,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const sub = payload.id;
    const user = await this.authService.validateUser(sub);
    
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
