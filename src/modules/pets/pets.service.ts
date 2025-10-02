import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Pet } from '@prisma/client';
import { PetWithRelations } from './pet.types';
import { CreatePetDTO } from './pets.dto';

@Injectable()
export class PetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreatePetDTO) {
    try {
      const pet = await this.prisma.pet.create({ data: payload });
      return pet;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.PetWhereInput;
    orderBy?: Prisma.PetOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.pet.findMany({
      skip,
      take,
      where: { ...(where || {}), isActive: true },
      orderBy,
      omit: {
        breedID: true,
        speciesID: true,
        shelterID: true,
      },
      include: {
        breed: {
          select: {
            id: true,
            name: true,
          },
        },
        species: {
          select: {
            id: true,
            name: true,
          },
        },
        shelter: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            country: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id, isActive: true },
      omit: {
        breedID: true,
        speciesID: true,
        shelterID: true,
      },
      include: {
        photos: {
          select: {
            image_url: true,
          },
        },
        species: {
          select: {
            id: true,
            name: true,
          },
        },
        breed: {
          select: {
            id: true,
            name: true,
          },
        },
        shelter: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            country: true,
            phoneNumber: true,
          },
        },
        adoption: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
    if (!pet) throw new NotFoundException(`Pet with ID ${id} not found or inactive`);
    return pet;
  }

  async update(id: string, payload: Prisma.PetUpdateInput) {
    const isPetValid = await this.prisma.pet.findUnique({
      where: { id: id },
      select: { id: true },
    });

    if (!isPetValid) {
      throw new NotFoundException(`Pet not found ${id}`);
    }

    try {
      const updatedPet = await this.prisma.pet.update({
        where: { id: isPetValid.id },
        data: { ...payload },
        omit: {
          breedID: true,
          speciesID: true,
          shelterID: true,
        },
        include: {
          breed: {
            select: {
              id: true,
              name: true,
            },
          },
          species: {
            select: {
              id: true,
              name: true,
            },
          },
          shelter: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return updatedPet;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string): Promise<PetWithRelations> {
    await this.findOne(id);

    return this.prisma.pet.update({
      where: { id },
      data: { isActive: false },
      include: {
        photos: true,
        shelter: true,
        breed: true,
        species: true,
        adoption: true,
        favorites: true,
      },
    });
  }

  async findAllWithInactive(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.PetWhereInput;
    orderBy?: Prisma.PetOrderByWithRelationInput;
  }): Promise<PetWithRelations[]> {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.pet.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        photos: true,
        shelter: true,
        breed: true,
        species: true,
        adoption: true,
        favorites: true,
      },
    });
  }

  async restore(id: string): Promise<PetWithRelations> {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: {
        photos: true,
        shelter: true,
        breed: true,
        species: true,
        adoption: true,
        favorites: true,
      },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    return this.prisma.pet.update({
      where: { id },
      data: { isActive: true },
      include: {
        photos: true,
        shelter: true,
        breed: true,
        species: true,
        adoption: true,
        favorites: true,
      },
    });
  }

  async findAllByShelter(id: string) {
    return this.prisma.pet.findMany({
      where: { shelterID: id, isActive: true },
      omit: {
        breedID: true,
        speciesID: true,
        shelterID: true,
      },
      include: {
        breed: {
          select: {
            name: true,
          },
        },
        adoption: {
          select: {
            status: true,
          },
        },
        shelter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
