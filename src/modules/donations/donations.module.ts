import { forwardRef, Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { MailService } from '../mail/mail.service';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [forwardRef(() => StripeModule)],
  controllers: [DonationsController],
  providers: [DonationsService, MailService],
  exports: [DonationsService],
})
export class DonationsModule {}
