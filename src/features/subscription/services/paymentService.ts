import { subscriptionRepository } from '../repository';
import type { PaymentOrderResponse, PaymentVerificationRequest, PaymentVerificationResponse, SubscriptionPayment } from '../types';

export class PaymentService {
  async createOrder(data: {
    planId?: number;
    addOnData?: { name: string; amount: string };
    billingCycle: 'monthly' | 'yearly';
  }): Promise<PaymentOrderResponse> {
    return subscriptionRepository.createSubscriptionOrder(data);
  }

  async verifyPayment(data: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    return subscriptionRepository.verifySubscriptionPayment(data);
  }

  async getHistory(): Promise<SubscriptionPayment[]> {
    return subscriptionRepository.getPaymentHistory();
  }
}

export const paymentService = new PaymentService();
