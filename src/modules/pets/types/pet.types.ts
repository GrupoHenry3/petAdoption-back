import { Prisma } from '@prisma/client';

export type PetWithRelations = Prisma.PetGetPayload<{
  include: {
    photos: true;
    shelter: true;
    breed: true;
    species: true;
    adoption: true;
    favorites: true;
  };
}>;
