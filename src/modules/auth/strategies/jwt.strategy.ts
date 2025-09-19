import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  type: string;
  site_admin: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: `${process.env.JWT_SECRET_TOKEN}`,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub } = payload;
    const user = await this.authService.validateUser(sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
