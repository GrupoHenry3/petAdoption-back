import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Pet } from '@prisma/client';
import { PetWithRelations } from './types/pet.types';

@Injectable()
export class PetService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PetCreateInput): Promise<Pet> {
    return this.prisma.pet.create({
      data,
      include: { photos: true },
    });
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
      select: {
        id: true,
        name: true,
        age: true,
        size:true,
        isActive: true,
        avatarURL: true,
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
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        size: true,
        adoptionFee: true,
        avatarURL: true,
        neutered: true,
        isAdopted: true,
        isActive: true,
        breed: {
          select: {
            id: true,
            name: true,
          },
        },
        photos: {
          select: {
            image_url: true,
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

  async update(id: string, data: Prisma.PetUpdateInput): Promise<PetWithRelations> {
    await this.findOne(id);

    return this.prisma.pet.update({
      where: { id },
      data,
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
      where, //no filtramos por isActive
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
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        size: true,
        avatarURL: true,
        isAdopted: true,
        createdAt: true,
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
