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
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/donation/cancel?session_id={CHECKOUT_SESSION_ID}`,
      payment_intent_data: {
        capture_method: 'automatic',
      },
      allow_promotion_codes: false,
      billing_address_collection: 'auto',
      // Configuración para manejar errores de pago
      custom_fields: [],
      submit_type: 'donate',
      // Deshabilitar el banner de error de Stripe
      ui_mode: 'hosted',
    });

    return res;
  }
}
