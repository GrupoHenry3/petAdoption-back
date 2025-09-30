import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SheltersController } from './shelters.controller';
import { SheltersService } from './shelters.service';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [MailModule],
  controllers: [SheltersController],
  providers: [SheltersService, PrismaService, MailService],
})
export class SheltersModule {}
