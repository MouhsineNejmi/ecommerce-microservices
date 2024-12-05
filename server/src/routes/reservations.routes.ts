import { Request, Response, Router } from 'express';

import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { validate } from '../middlewares/validator.middleware';
import { currentUser } from '../middlewares/current-user.middleware';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
import PaymentService from '../services/payment.service';
import config from '../config';

import {
  PaymentStatus,
  Reservation,
  ReservationAttrs,
  ReservationStatus,
} from '../models/reservations';
import { Listing } from '../models/listings';
import {
  createReservationValidation,
  updateReservationValidation,
} from '../validations/reservations.validation';
import { UserRole } from '../types/user.types';

const router = Router();
const paymentService = new PaymentService(config.stripe.secretKey as string);

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      minAmount,
      maxAmount,
      guestCount,
      userId,
      listingId,
      status,
      startDate,
      endDate,
    } = req.query;

    const filter: any = {};

    if (userId) filter.userId = req.user?.id;
    if (listingId) filter.listingId = listingId;
    if (status) filter.status = status;
    if (guestCount) filter.guestCount = guestCount;

    if (startDate || endDate) {
      filter.startDate = {
        ...(startDate && { $gte: new Date(startDate as string) }),
        ...(endDate && { $lte: new Date(endDate as string) }),
      };
    }
    if (minAmount || maxAmount) {
      filter.totalAmount = {
        ...(minAmount && { $gte: Number(minAmount) }),
        ...(maxAmount && { $lte: Number(maxAmount) }),
      };
    }

    const reservations = await Reservation.find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 })
      .populate('listingId', 'title location images');

    const total = await Reservation.countDocuments(filter);

    return res.status(200).json({
      data: reservations,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        total,
      },
    });
  })
);

router.use(currentUser);

router.post(
  '/',
  requireAuth,
  createReservationValidation,
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const { listingId, startDate, endDate, guestCount }: ReservationAttrs =
      req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    const isAvailable = await Reservation.checkAvailability(
      listingId,
      new Date(startDate),
      new Date(endDate)
    );
    if (!isAvailable) {
      throw new BadRequestError(
        'Listing is not available for the selected dates'
      );
    }

    const totalAmount = await Reservation.calculateTotalAmount(
      listingId,
      startDate,
      endDate
    );

    const reservation = Reservation.build({
      listingId,
      startDate,
      endDate,
      totalAmount,
      guestCount,
      status: ReservationStatus.PENDING,
      userId: req.user!.id,
      paymentStatus: PaymentStatus.PENDING,
    });
    await reservation.save();

    return res.status(201).json({ data: reservation });
  })
);

router.put(
  '/:id',
  requireAuth,
  updateReservationValidation,
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const { status, paymentStatus } = req.body;

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    if (
      String(req.user?.role) !== UserRole.ADMIN ||
      reservation.userId.toString() !== req.user!.id
    ) {
      throw new UnauthorizedError(
        'You are not authorized to update this reservation'
      );
    }

    if (req.body.startDate || req.body.endDate) {
      const isAvailable = await Reservation.checkAvailability(
        reservation.listingId,
        new Date(req.body.startDate || reservation.startDate),
        new Date(req.body.endDate || reservation.endDate),
        reservation.id
      );

      if (!isAvailable) {
        throw new BadRequestError(
          'Listing is not available for the selected dates'
        );
      }
    }

    Object.keys({ status, paymentStatus }).forEach((key) => {
      reservation.set(key, req.body[key]);
    });

    await reservation.save();

    return res.status(200).json({ data: reservation });
  })
);

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    if (
      String(req.user?.role) !== UserRole.ADMIN ||
      reservation.userId.toString() !== req.user!.id
    ) {
      throw new UnauthorizedError('Not authorized to cancel this reservation');
    }

    if (
      reservation.paymentStatus === PaymentStatus.COMPLETED &&
      reservation.paymentIntentId
    ) {
      const refund = await paymentService.processRefund(
        reservation.paymentIntentId
      );
      if (!refund.success) {
        throw new BadRequestError('Failed to process refund');
      }
    }

    reservation.set('status', ReservationStatus.CANCELLED);
    reservation.set('paymentStatus', PaymentStatus.REFUNDED);
    await reservation.save();

    return res.status(200).json({
      message: 'Reservation cancelled successfully',
      data: reservation,
    });
  })
);

router.post(
  '/:id/confirm-payment',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    if (
      String(req.user?.role) !== UserRole.ADMIN ||
      reservation.userId.toString() !== req.user!.id
    ) {
      throw new UnauthorizedError('Not authorized to confirm this payment');
    }

    const payment = await paymentService.confirmPayment(
      reservation.paymentIntentId!
    );

    if (payment.success) {
      reservation.set('status', ReservationStatus.CONFIRMED);
      reservation.set('paymentStatus', PaymentStatus.COMPLETED);
      await reservation.save();
    } else {
      throw new BadRequestError('Payment confirmation failed');
    }

    return res.status(200).json({
      message: 'Payment confirmed successfully',
      data: reservation,
    });
  })
);

export default router;
