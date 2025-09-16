import { Module } from '@nestjs/common';
import { PetController } from './pets.controller';
import { PetService } from './pets.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PetController],
  providers: [PetService, PrismaService],
})
export class PetModule {}
