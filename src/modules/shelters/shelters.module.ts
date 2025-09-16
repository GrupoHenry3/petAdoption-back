import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SheltersController } from './shelters.controller';
import { SheltersService } from './shelters.service';

@Module({
  controllers: [SheltersController],
  providers: [SheltersService, PrismaService],
})
export class SheltersModule {}
