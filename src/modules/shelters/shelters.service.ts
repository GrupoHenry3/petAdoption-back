import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShelterDTO, GetSheltersDTO, UpdateShelterDTO } from './shelters.dto';
import { Prisma, UserType } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SheltersService {
  private readonly logger = new Logger(SheltersService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(payload: ShelterDTO, userID: string) {
    const existingShelter = await this.prisma.shelter.findUnique({
      where: { userID: userID },
      select: { id: true },
    });

    if (existingShelter) {
      throw new ConflictException('This user already manages a shelter');
    }

    try {
      const tx = await this.prisma.$transaction(async (prisma) => {
        const newShelter = await prisma.shelter.create({
          data: {
            userID: userID,
            ...payload,
          },
          omit: {
            userID: true,
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
      this.logger.error('Failed to create shelter', error);
    }
  }

  async update(id: string, payload: UpdateShelterDTO) {
    const shelter = await this.prisma.shelter.findUnique({
      where: { id: id },
      select: { id: true },
    });

    if (!shelter) {
      throw new NotFoundException('Shelter not found');
    }

    try {
      const updatedShelter = await this.prisma.shelter.update({
        where: { id: shelter.id },
        data: { ...payload },
        omit: {
          userID: true,
        },
      });

      this.logger.log(`Succesfully updated shelter (${shelter.id})`);

      return updatedShelter;
    } catch (error) {
      this.logger.error(`Failed to update shelter (${shelter.id})`, error);
    }
  }

  async updateStatus(id: string) {
    const shelter = await this.prisma.shelter.findUnique({
      where: { id: id },
      select: { id: true, userID: true, name: true, isActive: true },
    });

    if (!shelter) {
      throw new NotFoundException('Shelter not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: shelter.userID },
      select: { id: true, userType: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const shelterStatus = !shelter.isActive;
    let userType: UserType;

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
      this.logger.error(`Failed to disable shelter ${shelter.id}`, error);
    }
  }

  async verify(id: string) {
    const shelter = await this.prisma.shelter.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        isVerified: true,
        user: true,
      },
    });

    if (!shelter) {
      throw new NotFoundException('Shelter not found');
    }

    const status = shelter.isVerified;

    try {
      const verifiedShelter = await this.prisma.shelter.update({
        where: { id: shelter.id },
        data: {
          isActive: !status,
        },
      });

      this.logger.log(`Verified shelter ${shelter.id}`);

      // await this.mailService.shelterVerificationConfirmation(shelter.user.email, shelter.name);

      return {
        statusCode: HttpStatus.OK,
        data: verifiedShelter,
      };
    } catch (error) {
      this.logger.error(`Failed to verify shelter ${shelter.id}`, error);
    }
  }

  async delete(id: string) {
    const shelter = await this.prisma.shelter.findUnique({
      where: { id: id },
      select: { id: true, userID: true, name: true },
    });

    if (!shelter) {
      throw new NotFoundException('Shelter not found');
    }

    try {
      const tx = await this.prisma.$transaction(async (prisma) => {
        const updatedShelter = await prisma.shelter.update({
          where: { id: shelter.id },
          data: {
            isActive: false,
          },
          select: {
            id: true,
            isActive: true,
          },
        });

        await prisma.user.update({
          where: { id: shelter.userID },
          data: { userType: 'User' },
        });

        return { updatedShelter };
      });

      this.logger.log(`Disabled shelter ${shelter.id}`);

      return {
        statusCode: HttpStatus.ACCEPTED,
        shelter: tx.updatedShelter,
      };
    } catch (error) {
      this.logger.error(`Failed to disable shelter ${shelter.id}`, error);
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
        omit: {
          userID: true,
        },
      });

      this.logger.log('Fetched data for all shelters');

      return shelters;
    } catch (error) {
      this.logger.error('Failed to fetch data for all shelters', error);
      throw new BadRequestException('An error has ocurred');
    }
  }

  async findOne(id: string) {
    const isShelter = await this.prisma.shelter.findUnique({
      where: { id: id },
      select: { id: true },
    });

    if (!isShelter) throw new NotFoundException('Shelter not found');

    try {
      const shelter = await this.prisma.shelter.findUnique({
        where: { id: isShelter.id },
        omit: {
          userID: true,
        },
        include: {
          adoptions: true,
          donations: true,
        },
      });

      this.logger.log(`Fetched data for user ${id}`);

      return shelter;
    } catch (error) {
      this.logger.error(`Failed to fetch data for shelter ${id}`, error);
      throw new BadRequestException('An error has ocurred');
    }
  }
}
