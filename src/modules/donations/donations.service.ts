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

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
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

    const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
      apiVersion: '2025-08-27.basil',
    });

    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Donation',
              },
              unit_amount: payload.amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/donation/cancel`,
      });

      this.logger.log('Checkout session created:', checkoutSession.id);

      const donation = await this.prisma.donation.create({
        data: {
          userID: userId,
          sessionID: checkoutSession.id,
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

      console.log(donation, checkoutSession.url);

      return checkoutSession.url;
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
