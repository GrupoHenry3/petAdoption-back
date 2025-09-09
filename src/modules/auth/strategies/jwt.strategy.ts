import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  async validate(payload: { id: number; type: 'user' | 'organization' }) {
    if (payload.type === 'user') {
      const user = await this.prisma.user.findUnique({ where: { id: payload.id } });

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } else if (payload.type === 'organization') {
      const org = await this.prisma.organization.findUnique({ where: { id: payload.id } });

      if (!org) {
        throw new UnauthorizedException();
      }

      return org;
    }
  }
}
