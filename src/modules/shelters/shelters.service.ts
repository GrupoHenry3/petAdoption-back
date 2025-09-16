import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetSheltersDTO, ShelterDTO, UpdateShelterDTO } from './shelters.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SheltersService {
  private readonly logger = new Logger(SheltersService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: ShelterDTO) {
    const existingShelter = await this.prisma.shelter.findUnique({
      where: { userID: payload.userID },
    });

    if (existingShelter) throw new ConflictException('This user already manages a shelter');

    try {
      const tx = await this.prisma.$transaction(async (prisma) => {
        const newShelter = await prisma.shelter.create({
          data: payload,
          select: {
            id: true,
            name: true,
            country: true,
            state: true,
            city: true,
            address: true,
            website: true,
            phoneNumber: true,
            description: true,
            createdAt: true,
          },
        });

        const updateUser = await prisma.user.update({
          where: { id: payload.userID },
          data: { userType: 'Shelter' },
        });

        this.logger.log('Shelter application successfull');

        return { newShelter, updateUser };
      });

      return {
        statusCode: HttpStatus.CREATED,
        shelter: tx.newShelter,
      };
    } catch (error) {
      this.logger.error('Error creating shelter', error.stack);
    }
  }

  async update(id: string, payload: UpdateShelterDTO) {
    const shelter = await this.prisma.shelter.findUnique({ where: { id: id } });

    if (!shelter) throw new NotFoundException();

    try {
      const updatedShelter = await this.prisma.shelter.update({
        where: { id: id },
        data: { ...payload },
        select: {
          id: true,
          name: true,
          country: true,
          state: true,
          city: true,
          address: true,
          website: true,
          phoneNumber: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log(`Succesfully updated shelter (${shelter.id})`);

      return updatedShelter;
    } catch (error) {
      this.logger.error(`Error updating shelter (${shelter.id})`);
    }
  }

  async delete(id: string) {
    const shelter = await this.prisma.shelter.findUnique({ where: { id: id } });

    if (!shelter) throw new NotFoundException();

    try {
      const updatedShelter = await this.prisma.shelter.update({
        where: { id: shelter?.id },
        data: {
          isActive: false,
        },
        select: {
          id: true,
          isActive: true,
        },
      });

      this.logger.log(`Successfully disabled shelter (${shelter.id})`);

      return updatedShelter;
    } catch (error) {
      this.logger.error(`Error disabling shelter ${shelter.id}`, error.stack);
    }
  }

  async findAll(filters: GetSheltersDTO) {
    const where: Prisma.ShelterWhereInput = {};

    if (filters.city) {
      where.city = filters.city;
    }

    if (filters.country) {
      where.country = filters.country;
    }

    if (filters.state) {
      where.state = filters.state;
    }

    try {
      const shelters = await this.prisma.shelter.findMany({
        where: where,
        select: {
          id: true,
          name: true,
          country: true,
          state: true,
          city: true,
          address: true,
          phoneNumber: true,
          website: true,
          description: true,
        },
      });

      return shelters;
    } catch (error) {
      this.logger.error('Error fetching shelters', error.stack);
    }
  }

  async findOne(id: string) {
    const isShelter = await this.prisma.shelter.findUnique({ where: { id: id } });

    if (!isShelter) throw new NotFoundException('Shelter not found');

    try {
      const shelter = await this.prisma.shelter.findUnique({
        where: { id: isShelter.id },
        select: {
          id: true,
          name: true,
          country: true,
          state: true,
          city: true,
          address: true,
          phoneNumber: true,
          website: true,
          description: true,
        },
      });

      return shelter;
    } catch (error) {
      this.logger.error('Error fetching shelters', error.stack);
    }
  }
}
