import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
<<<<<<< Updated upstream

@Module({
  controllers: [UsersController],
  providers: [UsersService],
=======
import { PrismaService } from '../../prisma/prisma.service';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UsersRepository],
>>>>>>> Stashed changes
})
export class UsersModule {}
