import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, MailService],
})
export class UsersModule {}
