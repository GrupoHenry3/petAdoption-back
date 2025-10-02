import { Module } from '@nestjs/common';
import { PetController } from './pets.controller';
import { PetService } from './pets.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // For some reason the app breaks if this isn't here, ONLY here . . .
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule {}
