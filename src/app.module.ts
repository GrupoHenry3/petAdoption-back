import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PetModule } from './modules/pets/pets.module';
import { SheltersModule } from './modules/shelters/shelters.module';
import { SpeciesModule } from './modules/species/species.module';
import { BreedsModule } from './modules/breeds/breeds.module';
import { DonationsModule } from './modules/donations/donations.module';
import { CloudinaryModule } from './modules/cloudinary/coudinary.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PetModule,
    SheltersModule,
    SpeciesModule,
    BreedsModule,
    DonationsModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
