"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
class PaymentService {
    constructor(stripeSecretKey) {
        this.stripe = new stripe_1.default(stripeSecretKey, {
            apiVersion: '2024-11-20.acacia',
        });
    }
    createPaymentIntent(amount_1) {
        return __awaiter(this, arguments, void 0, function* (amount, currency = 'usd', metadata) {
            try {
                const paymentIntent = yield this.stripe.paymentIntents.create({
                    amount: Math.round(amount * 100),
                    currency,
                    payment_method_types: ['card'],
                    metadata: metadata || {},
                });
                return {
                    success: true,
                    paymentIntentId: paymentIntent.id,
                };
            }
            catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown payment error',
                };
            }
        });
    }
    confirmPayment(paymentIntentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield this.stripe.paymentIntents.confirm(paymentIntentId);
                return {
                    success: paymentIntent.status === 'succeeded',
                    paymentIntentId: paymentIntent.id,
                };
            }
            catch (error) {
                return {
                    success: false,
                    error: error instanceof Error
                        ? error.message
                        : 'Payment confirmation failed',
                };
            }
        });
    }
    processRefund(paymentIntentId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield this.stripe.paymentIntents.retrieve(paymentIntentId);
                const refund = yield this.stripe.refunds.create({
                    payment_intent: paymentIntentId,
                    amount: amount ? Math.round(amount * 100) : paymentIntent.amount,
                });
                return {
                    success: refund.status === 'succeeded',
                    refundId: refund.id,
                };
            }
            catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Refund processing failed',
                };
            }
        });
    }
}
exports.default = PaymentService;
