import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';

@Module({
  controllers: [PetsController],
  providers: [PetsService, PrismaService],
})
export class PetsModule {}
