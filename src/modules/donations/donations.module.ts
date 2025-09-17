import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DonationsController],
  providers: [DonationsService, PrismaService],
})
export class DonationsModule {}
