import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryService, PrismaService],
})
export class CloudinaryModule {}
