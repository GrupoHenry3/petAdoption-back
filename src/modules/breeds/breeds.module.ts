import { Module } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { BreedsController } from './breeds.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BreedsController],
  providers: [BreedsService, PrismaService],
})
export class BreedsModule {}
