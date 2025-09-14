import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_SECRET}`,
      callbackURL: `${process.env.GOOGLE_CALLBACK}`,
      scope: ['profile', 'email'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<any> {
    const { id, name, emails, photos } = profile;

    const payload = {
      sub: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      avatarURL: photos[0].value,
    };

    const user = await this.authService.validateGoogleUser(payload);

    return user;
  }
}
