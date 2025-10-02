import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { DonationsModule } from '../donations/donations.module';

@Module({
  imports: [DonationsModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
