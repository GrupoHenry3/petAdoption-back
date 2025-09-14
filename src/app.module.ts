import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PetsModule } from './modules/pets/pets.module';

@Module({
  imports: [PetsModule, UsersModule, AuthModule],
})
export class AppModule {}
