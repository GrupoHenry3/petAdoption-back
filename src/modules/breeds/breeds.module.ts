import { Module } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { BreedsController } from './breeds.controller';

@Module({
  controllers: [BreedsController],
  providers: [BreedsService],
})
export class BreedsModule {}
