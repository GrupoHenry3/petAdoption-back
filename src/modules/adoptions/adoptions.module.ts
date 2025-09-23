import { Module } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';
import { AdoptionsRepository } from './adoptions.repository';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdoptionsController],
  providers: [AdoptionsService, AdoptionsRepository],
})
export class AdoptionsModule {}
