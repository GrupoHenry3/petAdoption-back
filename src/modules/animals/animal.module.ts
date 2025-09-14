import { Module } from '@nestjs/common';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AnimalController],
  providers: [AnimalService, PrismaService],
})
export class AnimalModule {}
