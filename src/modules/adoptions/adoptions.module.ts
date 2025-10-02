import { Module } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [AdoptionsController],
  providers: [AdoptionsService, MailService],
})
export class AdoptionsModule {}
