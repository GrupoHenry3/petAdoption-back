import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: `${process.env.GMAIL_USER}`,
          clientId: `${process.env.GOOGLE_CLIENT_ID}`,
          clientSecret: `${process.env.GOOGLE_SECRET}`,
          accessToken: `${process.env.GOOGLE_ACCESS_TOKEN}`,
          refreshToken: `${process.env.GOOGLE_REFRESH_TOKEN}`
        },
      },
      defaults: {
        from: 'Pet Adoption',
      },
      template: {
        dir: __dirname + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
