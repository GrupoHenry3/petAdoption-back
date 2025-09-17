import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateBreedDTO } from './breeds.dto';

@Injectable()
export class BreedsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload) {
    try {
      const breed = await this.prisma.petBreed.create({ data: payload });
      return breed;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    try {
      const breeds = await this.prisma.petBreed.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          speciesID: false,
          species: {
            select: {
              id: true,
              name: true,
            },
          },
          pets: {
            select: {
              id: true,
              name: true,
              avatarURL: true,
            },
          },
        },
      });

      return breeds;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    const breed = await this.prisma.petBreed.findUnique({
      where: { id: id },
      select: { id: true },
    });
    if (!breed) throw new NotFoundException('Pet breed not found');

    try {
      const breeds = await this.prisma.petBreed.findUnique({
        where: { id: breed.id },
      });
      return breeds;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: string, payload: UpdateBreedDTO) {
    const breed = await this.prisma.petBreed.findUnique({
      where: { id: id },
      select: { id: true, name: true },
    });

    if (!breed) throw new NotFoundException('Pet breed not found');

    try {
      const updatedBreed = await this.prisma.petBreed.update({
        where: { id: breed.id },
        data: {
          ...payload,
        },
      });

      return updatedBreed;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    const breed = await this.prisma.petBreed.findUnique({
      where: { id: id },
      select: { id: true, name: true },
    });

    if (!breed) throw new NotFoundException('Pet breed not found');

    return `Breed ${breed.name} deleted successfully`;
  }
}
