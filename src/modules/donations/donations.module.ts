import { Module, forwardRef } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [forwardRef(() => StripeModule)],
  controllers: [DonationsController],
  providers: [DonationsService, PrismaService, MailService],
  exports: [DonationsService],
})
export class DonationsModule {}
