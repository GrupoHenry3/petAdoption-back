import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
      apiVersion: '2025-08-27.basil',
    });
  }

  async checkoutSession(amount: number) {
    const res = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/dashboard/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/donation/cancel`,
      payment_intent_data: {
        capture_method: 'automatic',
        metadata: {
          type: 'donation',
          session_id: '{CHECKOUT_SESSION_ID}',
        },
      },
      metadata: {
        type: 'donation',
      },
      allow_promotion_codes: false,
      billing_address_collection: 'auto',
      custom_fields: [],
      submit_type: 'donate',
      ui_mode: 'hosted',
    });

    return res;
  }

  constructWebhookEvent(payload: string | Buffer, signature: string, secret: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }

  async retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      return null;
    }
  }
}
