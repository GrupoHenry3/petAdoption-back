import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PetModule } from './modules/pets/pets.module';
import { AdoptionsModule } from './modules/adoptions/adoptions.module';

@Module({
  imports: [UsersModule, AuthModule, PetModule, AdoptionsModule],
})
export class AppModule {}
