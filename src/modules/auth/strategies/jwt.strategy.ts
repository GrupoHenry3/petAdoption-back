import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    function getJWT(req) {
      let token = null;

      if (req && req.cookies) {
        token = req.cookies['access_token'];
      }

      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    }

    super({
      ignoreExpiration: false,
      jwtFromRequest: getJWT,
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  async validate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
