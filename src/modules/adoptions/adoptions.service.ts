import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AdoptionDTO, UpdateAdoptionDTO } from './adoptions.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdoptionStatus } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AdoptionsService {
  private readonly logger = new Logger(AdoptionsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async create(userId: string, payload: AdoptionDTO) {
    const hasAdoptionOpen = await this.prisma.adoption.findFirst({
      where: { status: AdoptionStatus.Pending, userID: userId },
    });

    if (hasAdoptionOpen) {
      throw new ConflictException('User has already opened an adoption application.');
    }

    try {
      const tx = await this.prisma.$transaction(async (prisma) => {
        const adoption = await prisma.adoption.create({
          data: {
            userID: userId,
            ...payload,
          },
        });

        const user = await prisma.user.findUnique({
          where: { id: adoption.userID },
          select: {
            fullName: true,
            email: true,
          },
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        const shelter = await prisma.shelter.findUnique({
          where: { id: adoption.shelterID },
          select: {
            name: true,
            user: true,
          },
        });

        if (!shelter) {
          throw new NotFoundException('Shelter not found');
        }

        this.logger.log('Adoption application created successfully.');

        return { adoption, user, shelter };
      });

      await this.mail.shelterAdoptionConfirmation(
        tx.shelter.user.email,
        tx.shelter.name,
        tx.adoption.id,
      );

      await this.mail.userAdoptionConfirmation(tx.user.email, tx.user.fullName, tx.adoption.id);

      return {
        statusCode: HttpStatus.CREATED,
        data: tx.adoption,
      };
    } catch (error) {
      this.logger.error(`Error creating adoption application: ${error.message}`, error.stack);
    }
  }

  async withdrawApplication(id: string) {
    const isAdoptionValid = await this.prisma.adoption.findUnique({
      where: { id: id },
      select: { id: true },
    });

    if (!isAdoptionValid) {
      throw new NotFoundException('Adoption not found');
    }

    try {
      const withdrawnAdoption = await this.prisma.adoption.update({
        where: { id: id },
        data: {
          status: AdoptionStatus.Withdrawn,
        },
      });

      this.logger.log('Adoption application withdrawn successfully.');

      return {
        statusCode: HttpStatus.OK,
        data: withdrawnAdoption,
      };
    } catch (error) {
      this.logger.error(`Failed to withdraw application: ${id}`, error);
    }
  }

  async updateStatus(id: string, payload: UpdateAdoptionDTO) {
    const isAdoptionValid = await this.prisma.adoption.findUnique({
      where: { id: id },
      select: { id: true },
    });

    if (!isAdoptionValid) {
      throw new NotFoundException('Adoption not found');
    }

    try {
      const updatedAdoption = await this.prisma.adoption.update({
        where: { id: id },
        data: {
          ...payload,
        },
      });

      this.logger.log('Adoption status updated successfully.');

      return {
        statusCode: HttpStatus.OK,
        data: updatedAdoption,
      };
    } catch (error) {
      this.logger.error(`Failed to update application: ${id}`, error);
    }
  }

  async delete(id: string) {
    const isAdoptionValid = await this.prisma.adoption.findUnique({
      where: { id: id },
      select: { id: true },
    });

    if (!isAdoptionValid) {
      throw new NotFoundException(`Adoption with id ${id} not found`);
    }

    try {
      await this.prisma.adoption.update({
        where: { id: id },
        data: {
          isActive: false,
        },
      });

      this.logger.log('Adoption has been deleted successfully.');

      return {
        statusCode: HttpStatus.OK,
        message: 'Adoption deleted sucessfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting adoption: ${error.message}`, error.stack);
    }
  }

  async findAll() {
    try {
      const adoptions = await this.prisma.adoption.findMany({
        omit: {
          petID: true,
          userID: true,
          shelterID: true,
        },
        include: {
          pet: {
            omit: {
              shelterID: true,
              breedID: true,
              speciesID: true,
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
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          shelter: {
            select: {
              id: true,
              name: true,
              user: {
                select: {
                  avatarURL: true,
                },
              },
            },
          },
        },
      });

      this.logger.log('Adoptions fetched successfully.');

      return adoptions;
    } catch (error) {
      this.logger.error(`Error fetching adoptions: ${error.message}`, error.stack);
    }
  }

  async findByShelter(shelterId: string) {
    const isShelterValid = await this.prisma.shelter.findUnique({
      where: { id: shelterId },
      select: { id: true },
    });

    if (!isShelterValid) {
      throw new NotFoundException('Shelter not found');
    }

    try {
      const adoptions = await this.prisma.adoption.findMany({
        where: { shelterID: isShelterValid.id },
      });

      this.logger.log('Adoptions fetched successfully.');

      return {
        statusCode: HttpStatus.OK,
        data: adoptions,
      };
    } catch (error) {
      this.logger.error(`Error fetching adoption: ${error.message}`, error.stack);
    }
  }

  async findOne(id: string) {
    const isAdoptionValid = await this.prisma.adoption.findUnique({
      where: { id: id },
      select: { id: true },
    });

    if (!isAdoptionValid) {
      throw new NotFoundException('Adoption not found');
    }

    try {
      const adoption = await this.prisma.adoption.findUnique({
        where: { id: isAdoptionValid.id },
      });

      this.logger.log('Adoptions fetched successfully.');

      return {
        statusCode: HttpStatus.OK,
        data: adoption,
      };
    } catch (error) {
      this.logger.error(`Error fetching adoption: ${error.message}`, error.stack);
    }
  }
}
