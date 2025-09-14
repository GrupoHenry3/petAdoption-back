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
  }): Promise<PetWithRelations[]> {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.pet.findMany({
      skip,
      take,
      where: { ...(where || {}), isActive: true }, // solo activos
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

  async findOne(id: string): Promise<PetWithRelations> {
    const pet = await this.prisma.pet.findFirst({
      where: { id, isActive: true }, // solo activos
      include: {
        photos: true,
        shelter: true,
        breed: true,
        species: true,
        adoption: true,
        favorites: true,
      },
    });
    if (!pet) throw new NotFoundException(`Pet with ID ${id} not found or inactive`);
    return pet;
  }

  async update(id: string, data: Prisma.PetUpdateInput): Promise<PetWithRelations> {
    // valida existencia y activo
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
    // soft delete
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

  //-----ADMIN--------//
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
}
