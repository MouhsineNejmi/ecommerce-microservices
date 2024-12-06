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
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = require("../utils/async-handler");
const require_auth_middleware_1 = require("../middlewares/require-auth.middleware");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const current_user_middleware_1 = require("../middlewares/current-user.middleware");
const errors_1 = require("../errors");
const payment_service_1 = __importDefault(require("../services/payment.service"));
const config_1 = __importDefault(require("../config"));
const reservations_1 = require("../models/reservations");
const listings_1 = require("../models/listings");
const reservations_validation_1 = require("../validations/reservations.validation");
const user_types_1 = require("../types/user.types");
const router = (0, express_1.Router)();
const paymentService = new payment_service_1.default(config_1.default.stripe.secretKey);
router.use(current_user_middleware_1.currentUser);
router.get('/', require_auth_middleware_1.requireAuth, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page = 1, limit = 10, minAmount, maxAmount, guestCount, userId, listingId, status, startDate, endDate, search, } = req.query;
    const filter = {};
    if (userId)
        filter.userId = new mongoose_1.default.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    if (listingId)
        filter.listingId = new mongoose_1.default.Types.ObjectId(listingId);
    if (status)
        filter.status = status;
    if (guestCount)
        filter.guestCount = guestCount;
    if (startDate) {
        filter.startDate = Object.assign({}, (startDate && { $gte: new Date(startDate) }));
    }
    if (endDate) {
        filter.endDate = Object.assign({}, (endDate && { $lte: new Date(endDate) }));
    }
    if (minAmount || maxAmount) {
        filter.totalAmount = Object.assign(Object.assign({}, (minAmount && { $gte: Number(minAmount) })), (maxAmount && { $lte: Number(maxAmount) }));
    }
    if (search) {
        filter.$or = {
            status: { $regex: new RegExp(search, 'i') },
        };
    }
    const reservations = yield reservations_1.Reservation.find(filter)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ createdAt: -1 })
        .populate('listingId', 'title location images')
        .populate('userId', 'avatar name');
    const total = yield reservations_1.Reservation.countDocuments(filter);
    return res.status(200).json({
        data: reservations,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            total,
        },
    });
})));
router.post('/', require_auth_middleware_1.requireAuth, reservations_validation_1.createReservationValidation, validator_middleware_1.validate, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { listingId, startDate, endDate, guestCount } = req.body;
    const listing = yield listings_1.Listing.findById(listingId);
    if (!listing) {
        throw new errors_1.NotFoundError('Listing not found');
    }
    const isAvailable = yield reservations_1.Reservation.checkAvailability(listingId, new Date(startDate), new Date(endDate));
    if (!isAvailable) {
        throw new errors_1.BadRequestError('Listing is not available for the selected dates');
    }
    const totalAmount = yield reservations_1.Reservation.calculateTotalAmount(listingId, startDate, endDate);
    const reservation = reservations_1.Reservation.build({
        listingId,
        startDate,
        endDate,
        totalAmount,
        guestCount,
        status: reservations_1.ReservationStatus.PENDING,
        userId: req.user.id,
        paymentStatus: reservations_1.PaymentStatus.PENDING,
    });
    yield reservation.save();
    return res.status(201).json({ data: reservation });
})));
router.put('/:id', require_auth_middleware_1.requireAuth, reservations_validation_1.updateReservationValidation, validator_middleware_1.validate, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { status, paymentStatus } = req.body;
    const reservation = yield reservations_1.Reservation.findById(req.params.id);
    if (!reservation) {
        throw new errors_1.NotFoundError('Reservation not found');
    }
    if (String((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== user_types_1.UserRole.ADMIN ||
        reservation.userId.toString() !== req.user.id) {
        throw new errors_1.UnauthorizedError('You are not authorized to update this reservation');
    }
    if (req.body.startDate || req.body.endDate) {
        const isAvailable = yield reservations_1.Reservation.checkAvailability(reservation.listingId, new Date(req.body.startDate || reservation.startDate), new Date(req.body.endDate || reservation.endDate), reservation.id);
        if (!isAvailable) {
            throw new errors_1.BadRequestError('Listing is not available for the selected dates');
        }
    }
    Object.keys({ status, paymentStatus }).forEach((key) => {
        reservation.set(key, req.body[key]);
    });
    yield reservation.save();
    return res.status(200).json({ data: reservation });
})));
router.delete('/:id', require_auth_middleware_1.requireAuth, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const reservation = yield reservations_1.Reservation.findById(req.params.id);
    if (!reservation) {
        throw new errors_1.NotFoundError('Reservation not found');
    }
    if (String((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== user_types_1.UserRole.ADMIN ||
        reservation.userId.toString() !== req.user.id) {
        throw new errors_1.UnauthorizedError('Not authorized to cancel this reservation');
    }
    if (reservation.paymentStatus === reservations_1.PaymentStatus.COMPLETED &&
        reservation.paymentIntentId) {
        const refund = yield paymentService.processRefund(reservation.paymentIntentId);
        if (!refund.success) {
            throw new errors_1.BadRequestError('Failed to process refund');
        }
    }
    reservation.set('status', reservations_1.ReservationStatus.CANCELLED);
    reservation.set('paymentStatus', reservations_1.PaymentStatus.REFUNDED);
    yield reservation.save();
    return res.status(200).json({
        message: 'Reservation cancelled successfully',
        data: reservation,
    });
})));
router.post('/:id/confirm-payment', require_auth_middleware_1.requireAuth, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const reservation = yield reservations_1.Reservation.findById(req.params.id);
    if (!reservation) {
        throw new errors_1.NotFoundError('Reservation not found');
    }
    if (String((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== user_types_1.UserRole.ADMIN ||
        reservation.userId.toString() !== req.user.id) {
        throw new errors_1.UnauthorizedError('Not authorized to confirm this payment');
    }
    const payment = yield paymentService.confirmPayment(reservation.paymentIntentId);
    if (payment.success) {
        reservation.set('status', reservations_1.ReservationStatus.CONFIRMED);
        reservation.set('paymentStatus', reservations_1.PaymentStatus.COMPLETED);
        yield reservation.save();
    }
    else {
        throw new errors_1.BadRequestError('Payment confirmation failed');
    }
    return res.status(200).json({
        message: 'Payment confirmed successfully',
        data: reservation,
    });
})));
exports.default = router;
