import { Module } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AdoptionsController],
  providers: [AdoptionsService, PrismaService],
})
export class AdoptionsModule {}
