import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Pet } from '@prisma/client';

@Injectable()
export class PetService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PetCreateInput): Promise<Pet> {
    return this.prisma.pet.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.PetWhereInput;
    orderBy?: Prisma.PetOrderByWithRelationInput;
  }): Promise<Pet[]> {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.pet.findMany({
      skip,
      take,
      where: { ...(where || {}), isActive: true }, // solo activos
      orderBy,
      include: {
        shelter: true,
        breed: true,
        species: true,
        adoption: true,
        favorites: true,
      },
    });
  }

  async findOne(id: string): Promise<Pet> {
    const pet = await this.prisma.pet.findFirst({
      where: { id, isActive: true }, // solo activos
      include: {
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

  async update(id: string, data: Prisma.PetUpdateInput): Promise<Pet> {
    return this.prisma.pet.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Pet> {
    // soft delete
    return this.prisma.pet.update({
      where: { id },
      data: { isActive: false },
    });
  }
  //-----ADMIN--------//
  async findAllWithInactive(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.PetWhereInput;
    orderBy?: Prisma.PetOrderByWithRelationInput;
  }): Promise<Pet[]> {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.pet.findMany({
      skip,
      take,
      where, // acá no filtramos por isActive
      orderBy,
      include: {
        shelter: true,
        breed: true,
        species: true,
        adoption: true,
        favorites: true,
      },
    });
  }
}
