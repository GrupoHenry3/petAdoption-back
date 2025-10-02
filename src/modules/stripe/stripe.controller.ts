import { Controller, Post, Req, Res, Headers, Logger, Inject, forwardRef } from '@nestjs/common';
import type { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { DonationsService } from '../donations/donations.service';
import type Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(
    private readonly stripeService: StripeService,
    @Inject(forwardRef(() => DonationsService))
    private readonly donationsService: DonationsService,
  ) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      this.logger.error('Stripe webhook secret not configured');
      return res.status(500).send('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      // Verificar la firma del webhook - usar rawBody para Stripe
      const rawBody = (req as any).rawBody || req.body;
      event = this.stripeService.constructWebhookEvent(rawBody, signature, endpointSecret);
    } catch (err: any) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    this.logger.log(`Received webhook event: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;

        case 'checkout.session.expired':
          await this.handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session);
          break;

        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case 'charge.failed':
          await this.handleChargeFailed(event.data.object as Stripe.Charge);
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      res.status(200).send('Webhook handled successfully');
    } catch (error) {
      this.logger.error(`Error handling webhook: ${error.message}`, error.stack);
      res.status(500).send('Webhook handler error');
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    this.logger.log(`Checkout session completed: ${session.id}`);

    try {
      // Marcar la donación como completada
      await this.donationsService.markDonationAsCompleted(session.id);
      this.logger.log(`Donation marked as completed for session: ${session.id}`);
    } catch (error) {
      this.logger.error(`Error marking donation as completed: ${error.message}`);
      throw error;
    }
  }

  private async handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
    this.logger.log(`Checkout session expired: ${session.id}`);

    try {
      // Marcar la donación como expirada
      await this.donationsService.markDonationAsExpired(session.id);
      this.logger.log(`Donation marked as expired for session: ${session.id}`);
    } catch (error) {
      this.logger.error(`Error marking donation as expired: ${error.message}`);
      throw error;
    }
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    this.logger.log(`Payment intent succeeded: ${paymentIntent.id}`);

    try {
      // Obtener la sesión de checkout asociada
      const session = await this.stripeService.retrieveCheckoutSession(
        paymentIntent.metadata?.session_id,
      );
      if (session) {
        await this.donationsService.markDonationAsCompleted(session.id);
        this.logger.log(`Donation marked as completed for payment intent: ${paymentIntent.id}`);
      }
    } catch (error) {
      this.logger.error(`Error handling payment intent success: ${error.message}`);
      throw error;
    }
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    this.logger.log(`Payment intent failed: ${paymentIntent.id}`);
    this.logger.log(`Payment intent metadata:`, paymentIntent.metadata);

    try {
      // Buscar la donación por el payment_intent_id en lugar de session_id
      const donation = await this.donationsService.findByPaymentIntentId(paymentIntent.id);
      
      if (donation) {
        await this.donationsService.markDonationAsFailed(
          donation.sessionID,
          paymentIntent.last_payment_error?.message || 'Payment failed',
        );
        this.logger.log(`Donation marked as failed for payment intent: ${paymentIntent.id}`);
      } else {
        this.logger.warn(`No donation found for payment intent: ${paymentIntent.id}`);
      }
    } catch (error) {
      this.logger.error(`Error handling payment intent failure: ${error.message}`);
      throw error;
    }
  }

  private async handleChargeFailed(charge: Stripe.Charge) {
    this.logger.log(`Charge failed: ${charge.id}`);
    this.logger.log(`Charge payment intent: ${charge.payment_intent}`);

    try {
      // Buscar la donación por el payment_intent_id del charge
      const donation = await this.donationsService.findByPaymentIntentId(charge.payment_intent as string);
      
      if (donation) {
        const failureReason = charge.failure_message || charge.outcome?.seller_message || 'Payment failed';
        await this.donationsService.markDonationAsFailed(
          donation.sessionID,
          failureReason,
        );
        this.logger.log(`Donation marked as failed for charge: ${charge.id}`);
      } else {
        this.logger.warn(`No donation found for charge payment intent: ${charge.payment_intent}`);
      }
    } catch (error) {
      this.logger.error(`Error handling charge failure: ${error.message}`);
      throw error;
    }
  }
}
