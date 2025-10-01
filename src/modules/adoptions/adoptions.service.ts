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

@Injectable()
export class AdoptionsService {
  private readonly logger = new Logger(AdoptionsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, payload: AdoptionDTO) {
    const hasAdoptionOpen = await this.prisma.adoption.findFirst({
      where: { status: AdoptionStatus.Pending, userID: userId },
    });

    if (hasAdoptionOpen) {
      throw new ConflictException('User has already opened an adoption application.');
    }

    try {
      const newAdoption = await this.prisma.adoption.create({
        data: {
          userID: userId,
          ...payload,
        },
      });

      this.logger.log('Adoption application created successfully.');

      return {
        statusCode: HttpStatus.CREATED,
        data: newAdoption,
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
      const adoptions = await this.prisma.adoption.findMany();

      this.logger.log('Adoptions fetched successfully.');

      return {
        statusCode: HttpStatus.OK,
        data: adoptions,
      };
    } catch (error) {
      this.logger.error(`Error fetching adoptions: ${error.message}`, error.stack);
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
