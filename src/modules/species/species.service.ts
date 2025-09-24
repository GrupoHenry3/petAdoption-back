import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpeciesDTO } from './species.dto';

@Injectable()
export class SpeciesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: SpeciesDTO) {
    try {
      const species = await this.prisma.petSpecies.create({ data: payload });
      return species;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.petSpecies.findMany();
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    const species = await this.prisma.petSpecies.findUnique({
      where: { id: id },
    });
    if (!species) throw new NotFoundException('Species not found');

    try {
      return await this.prisma.petSpecies.findUnique({
        where: { id: species.id },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: string, payload: SpeciesDTO) {
    const species = await this.prisma.petSpecies.findUnique({
      where: { id: id },
    });
    if (!species) throw new NotFoundException('Species not found');

    try {
      const updatedSpecies = await this.prisma.petSpecies.update({
        where: { id: species.id },
        data: { ...payload },
      });

      return updatedSpecies;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    const species = await this.prisma.petSpecies.findUnique({
      where: { id: id },
    });
    if (!species) throw new NotFoundException('Species not found');

    return `${species.name} has been deleted`;
  }
}
