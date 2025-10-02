import { Controller, Post, Req, Res, Headers, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { DonationsService } from '../donations/donations.service';
import type Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(
    private readonly stripeService: StripeService,
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
      // Verificar la firma del webhook
      event = this.stripeService.constructWebhookEvent(req.body, signature, endpointSecret);
    } catch (err) {
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

    try {
      const session = await this.stripeService.retrieveCheckoutSession(
        paymentIntent.metadata?.session_id,
      );
      if (session) {
        await this.donationsService.markDonationAsFailed(
          session.id,
          paymentIntent.last_payment_error?.message || 'Payment failed',
        );
        this.logger.log(`Donation marked as failed for payment intent: ${paymentIntent.id}`);
      }
    } catch (error) {
      this.logger.error(`Error handling payment intent failure: ${error.message}`);
      throw error;
    }
  }
}
