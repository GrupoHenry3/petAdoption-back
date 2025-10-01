import { Module } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [AdoptionsController],
  providers: [AdoptionsService, PrismaService, MailService],
})
export class AdoptionsModule {}
