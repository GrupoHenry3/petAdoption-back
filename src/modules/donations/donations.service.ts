import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DonationDTO } from './donations.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import Stripe from 'stripe';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly stripeService: StripeService,
  ) {}

  async create(userId: string, payload: DonationDTO) {
    const isUserValid = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!isUserValid) {
      throw new NotFoundException('User not found');
    }

    const isShelterValid = await this.prisma.shelter.findUnique({
      where: { id: payload.shelterID },
    });

    if (!isShelterValid) {
      throw new NotFoundException('Shelter not found');
    }

    if (!payload.amount || payload.amount <= 0) {
      throw new InternalServerErrorException('Invalid donation amount');
    }

    try {
      const checkout = await this.stripeService.checkoutSession(payload.amount);
      this.logger.log('Checkout session created:', checkout.id);

      const donation = await this.prisma.donation.create({
        data: {
          userID: userId,
          sessionID: checkout.id,
          ...payload,
        },
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

      return {
        sessionUrl: checkout.url,
        sessionId: checkout.id,
      };
    } catch (error) {
      this.logger.error('Failed to create donation', error);
      throw new InternalServerErrorException('An unexpected error has ocurred');
    }
  }

  async failed(payload: { sessionId: string; errorReason: string }) {
    try {
      const donation = await this.prisma.donation.findFirst({
        where: { sessionID: payload.sessionId },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
          shelter: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!donation) {
        throw new NotFoundException('Donation not found');
      }

      await this.mailService.userFailedPayment(
        donation.user.email,
        donation.user.fullName,
        donation.shelter.name,
        donation.amount,
        payload.errorReason,
      );

      this.logger.log(`Payment failure notification sent for donation ${donation.id}`);

      return {
        message: 'Payment failure notification sent successfully',
        donation: {
          id: donation.id,
          amount: donation.amount,
          shelterName: donation.shelter.name,
        },
      };
    } catch (error) {
      this.logger.error('Error handling payment failure', error);
      throw new InternalServerErrorException(
        'An unexpected error has ocurred while handling payment failure',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.donation.findMany();
    } catch (error) {
      this.logger.error(`Failed to fetch donations`, error);
      throw new InternalServerErrorException(
        'An unexpected error has ocurred while fetching donations',
      );
    }
  }

  async findByUser(userId: string) {
    const isUserValid = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!isUserValid) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    try {
      return await this.prisma.donation.findMany({ where: { userID: isUserValid.id } });
    } catch (error) {
      this.logger.error(`Failed to fetch donations for user ${isUserValid.id}`, error);
      throw new InternalServerErrorException(
        'An unexpected error has ocurred while fetching donations',
      );
    }
  }

  async findByShelter(userId: string) {
    const isUserValid = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
      },
    });

    if (!isUserValid) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    const shelter = await this.prisma.shelter.findUnique({
      where: { userID: isUserValid.id },
      select: { id: true },
    });

    if (!shelter) {
      throw new NotFoundException('Shelter not found');
    }

    try {
      return await this.prisma.donation.findMany({ where: { shelterID: shelter.id } });
    } catch (error) {
      this.logger.error(`Failed to fetch donations for shelter ${shelter.id}`, error);
      throw new InternalServerErrorException(
        'An unexpected error has ocurred while fetching donations',
      );
    }
  }
}
