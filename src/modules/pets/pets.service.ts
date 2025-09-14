import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PetCreateInput) {
    return this.prisma.pet.create({
      data,
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
      where: {
        isActive: true,
        ...where,
      },
      orderBy,
      include: {
        breed: true,
        shelter: true,
        adoption: true,
      },
    });
  }

  async findOne(id: string) {
    const animal = await this.prisma.pet.findFirst({
      where: { id, isActive: true },
      include: {
        breed: true,
        shelter: true,
        adoption: true,
      },
    });
    if (!animal) throw new NotFoundException(`Pet with ID ${id} not found`);
    return animal;
  }

  async update(id: string, data: Prisma.PetUpdateInput) {
    const exists = await this.prisma.pet.findUnique({ where: { id } });
    if (!exists || !exists.isActive) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    return this.prisma.pet.update({
      where: { id },
      data,
    });
  }

  // Soft delete
  async remove(id: string) {
    const exists = await this.prisma.pet.findUnique({ where: { id } });

    if (!exists || !exists.isActive) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    return this.prisma.pet.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
