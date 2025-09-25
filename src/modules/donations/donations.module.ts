import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { StripeService } from '../stripe/stripe.service';

@Module({
  controllers: [DonationsController],
  providers: [DonationsService, PrismaService, MailService, StripeService],
})
export class DonationsModule {}
