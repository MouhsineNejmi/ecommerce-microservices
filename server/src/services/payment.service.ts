import Stripe from 'stripe';

interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

interface RefundResult {
  success: boolean;
  refundId?: string;
  error?: string;
}

class PaymentService {
  private stripe: Stripe;

  constructor(stripeSecretKey: string) {
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>
  ): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        payment_method_types: ['card'],
        metadata: metadata || {},
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error',
      };
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId
      );

      return {
        success: paymentIntent.status === 'succeeded',
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Payment confirmation failed',
      };
    }
  }

  async processRefund(
    paymentIntentId: string,
    amount?: number
  ): Promise<RefundResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : paymentIntent.amount,
      });

      return {
        success: refund.status === 'succeeded',
        refundId: refund.id,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Refund processing failed',
      };
    }
  }
}

export default PaymentService;
