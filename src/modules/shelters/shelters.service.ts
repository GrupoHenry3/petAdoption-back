import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShelterDTO, GetSheltersDTO, UpdateShelterDTO } from './shelters.dto';
import { Prisma, UserType } from '@prisma/client';

@Injectable()
export class SheltersService {
  private readonly logger = new Logger(SheltersService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: ShelterDTO, userID: string) {
    const existingShelter = await this.prisma.shelter.findUnique({
      where: { userID: userID },
    });

    if (existingShelter) throw new ConflictException('This user already manages a shelter');

    try {
      const tx = await this.prisma.$transaction(async (prisma) => {
        const newShelter = await prisma.shelter.create({
          data: {
            userID: userID,
            name: payload.name,
            country: payload.country,
            state: payload.state,
            city: payload.city,
            address: payload.address,
            phoneNumber: payload.phoneNumber,
          },
          select: {
            id: true,
            name: true,
            country: true,
            state: true,
            city: true,
            address: true,
            phoneNumber: true,
            createdAt: true,
          },
        });

        const updateUser = await prisma.user.update({
          where: { id: userID },
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

  async updateStatus(id: string) {
    const shelter = await this.prisma.shelter.findUnique({
      where: { id: id },
      select: { id: true, userID: true, name: true, isActive: true },
    });
    if (!shelter) throw new NotFoundException('Shelter not found');

    const user = await this.prisma.user.findUnique({
      where: { id: shelter.userID },
      select: { id: true, userType: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const shelterStatus = !shelter.isActive;
    let userType: any;

    if (user.userType === 'Shelter') {
      userType = 'User';
    } else {
      userType = 'Shelter';
    }

    try {
      const tx = await this.prisma.$transaction(async (prisma) => {
        const updatedShelter = await prisma.shelter.update({
          where: { id: shelter?.id },
          data: {
            isActive: shelterStatus,
          },
          select: {
            id: true,
            isActive: true,
          },
        });

        const updateUser = await prisma.user.update({
          where: { id: shelter.userID },
          data: { userType: userType },
        });

        return { updatedShelter, updateUser };
      });

      this.logger.log(`Shelter ${shelter.name} status updated successfully`);

      return {
        statusCode: HttpStatus.ACCEPTED,
        shelter: tx.updatedShelter,
      };
    } catch (error) {
      this.logger.error(`Error disabling shelter ${shelter.id}`, error.stack);
    }
  }

  async verifyShelter(id: string) {
    const shelter = await this.prisma.shelter.findUnique({
      where: { id: id },
      select: { id: true, name: true, isVerified: true },
    });

    if (!shelter) throw new NotFoundException('Shelter not found');

    const newVerificationStatus = !shelter.isVerified;

    try {
      const updatedShelter = await this.prisma.shelter.update({
        where: { id: shelter.id },
        data: {
          isVerified: newVerificationStatus,
        },
        select: {
          id: true,
          name: true,
          isVerified: true,
          updatedAt: true,
        },
      });

      this.logger.log(`Shelter ${shelter.name} verification status updated to ${newVerificationStatus}`);

      return {
        statusCode: HttpStatus.ACCEPTED,
        message: `Shelter ${newVerificationStatus ? 'verified' : 'unverified'} successfully`,
        shelter: updatedShelter,
      };
    } catch (error) {
      this.logger.error(`Error updating shelter verification status ${shelter.id}`, error.stack);
      throw new Error('An error occurred while updating shelter verification status');
    }
  }

  async delete(id: string) {
    const shelter = await this.prisma.shelter.findUnique({ where: { id: id } });

    if (!shelter) throw new NotFoundException('Shelter not found');

    try {
      const tx = await this.prisma.$transaction(async (prisma) => {
        const updatedShelter = await prisma.shelter.update({
          where: { id: shelter?.id },
          data: {
            isActive: false,
          },
          select: {
            id: true,
            isActive: true,
          },
        });

        const updateUser = await prisma.user.update({
          where: { id: shelter.userID },
          data: { userType: 'User' },
        });

        return { updatedShelter };
      });

      this.logger.log(`Shelter ${shelter.name} deactivated successfully`);

      return {
        statusCode: HttpStatus.ACCEPTED,
        shelter: tx.updatedShelter,
      };
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
          isVerified: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return shelters;
    } catch (error) {
      this.logger.error('Error fetching shelters', error.stack);
    }
  }

  async findOne(id: string) {
    const isShelter = await this.prisma.shelter.findUnique({
      where: { id: id },
    });

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
          isVerified: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          adoptions: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  phoneNumber: true,
                  avatarURL: true,
                },
              },
              pet: {
                select: {
                  id: true,
                  name: true,
                  age: true,
                  gender: true,
                  size: true,
                  avatarURL: true,
                  breed: {
                    select: {
                      name: true,
                    },
                  },
                  species: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return shelter;
    } catch (error) {
      this.logger.error('Error fetching shelters', error.stack);
    }
  }
}
