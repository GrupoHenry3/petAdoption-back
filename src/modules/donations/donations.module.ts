import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { MailService } from '../mail/mail.service';
import { StripeService } from '../stripe/stripe.service';

@Module({
  controllers: [DonationsController],
  providers: [DonationsService, MailService, StripeService],
})
export class DonationsModule {}
