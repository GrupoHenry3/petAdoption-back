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

  async findByUser(userId: string) {
    try {
      const donations = await this.prisma.donation.findMany({
        where: { userID: userId },
        include: {
          shelter: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
              country: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      this.logger.log(`Donations for user ${userId} fetched successfully.`);
      return donations;
    } catch (error) {
      this.logger.error(`Error fetching user donations: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'An unexpected error has ocurred while fetching user donations',
      );
    }
  }

  async findByShelter(shelterId: string) {
    try {
      const donations = await this.prisma.donation.findMany({
        where: { shelterID: shelterId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      this.logger.log(`Donations for shelter ${shelterId} fetched successfully.`);
      return donations;
    } catch (error) {
      this.logger.error(`Error fetching shelter donations: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'An unexpected error has ocurred while fetching shelter donations',
      );
    }
  }

  async findUserShelter(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          shelter: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return user;
    } catch (error) {
      this.logger.error(`Error fetching user shelter: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'An unexpected error has ocurred while fetching user shelter',
      );
    }
  }

  async handlePaymentFailure(sessionId: string, errorReason: string) {
    try {
      // Buscar la donación por sessionID
      const donation = await this.prisma.donation.findFirst({
        where: { sessionID: sessionId },
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

      // Enviar email de notificación de fallo
      await this.mailService.paymentFailedNotification(
        donation.user.email,
        donation.user.fullName,
        donation.shelter.name,
        donation.amount,
        errorReason,
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
      this.logger.error(`Error handling payment failure: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'An unexpected error has ocurred while handling payment failure',
      );
    }
  }
}
