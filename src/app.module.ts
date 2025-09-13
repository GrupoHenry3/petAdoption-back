import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AnimalModule } from './modules/animals/animal.module';

@Module({
  imports: [UsersModule, AuthModule, AnimalModule],
})
export class AppModule {}
