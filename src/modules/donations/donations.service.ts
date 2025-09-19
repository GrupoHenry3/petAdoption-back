import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DonationDTO } from './donations.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: DonationDTO) {
    try {
      return await this.prisma.donation.create({
        data: payload,
      });
    } catch (error) {
      this.logger.error(`Error creating donation: ${error.message}`, error.stack);
      throw new InternalServerErrorException('An unexpected error has ocurred');
    }
  }

  async findAll() {
    try {
      return await this.prisma.donation.findMany();
    } catch (error) {
      this.logger.error(`Error fetching donations: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'An unexpected error has ocurred while fetching donations',
      );
    }
  }
}
