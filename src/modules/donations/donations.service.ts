import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DonationDTO } from './donations.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(payload: DonationDTO) {
    try {
      const donation = await this.prisma.donation.create({
        data: payload,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: donation.userID },
        select: { fullName: true, email: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const shelter = await this.prisma.shelter.findUnique({
        where: { id: donation.shelterID },
        select: {
          name: true,
          user: {
            select: { email: true },
          },
        },
      });

      if (!shelter) {
        throw new NotFoundException('Shelter not fund');
      }

      await this.mailService.shelterDonationConfirmation(
        shelter.name,
        shelter.user.email,
        user.fullName,
        donation.id,
        donation.amount,
        donation.message || '',
      );

      await this.mailService.userDonationConfirmation(
        user.email,
        user.fullName,
        shelter.name,
        donation.amount,
      );
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
