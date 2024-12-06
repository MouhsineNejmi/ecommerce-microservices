"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = exports.PaymentStatus = exports.ReservationStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const listings_1 = require("./listings");
const errors_1 = require("../errors");
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["PENDING"] = "pending";
    ReservationStatus["CONFIRMED"] = "confirmed";
    ReservationStatus["CANCELLED"] = "cancelled";
    ReservationStatus["COMPLETED"] = "completed";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
const reservationSchema = new mongoose_1.Schema({
    listingId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startDate: {
        type: mongoose_1.default.Schema.Types.Date,
        required: true,
    },
    endDate: {
        type: mongoose_1.default.Schema.Types.Date,
        required: true,
    },
    guestCount: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ReservationStatus,
        default: ReservationStatus.PENDING,
    },
    paymentStatus: {
        type: String,
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    },
    paymentIntentId: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
        versionKey: false,
    },
});
reservationSchema.statics.build = (attrs) => {
    return new Reservation(attrs);
};
reservationSchema.statics.checkAvailability = function (listingId, startDate, endDate, excludeReservationId) {
    return __awaiter(this, void 0, void 0, function* () {
        const overlapping = yield this.find(Object.assign({ listingId, status: { $nin: ['cancelled'] }, $or: [
                {
                    startDate: { $lte: endDate },
                    endDate: { $gte: startDate },
                },
            ] }, (excludeReservationId && { _id: { $ne: excludeReservationId } })));
        return overlapping.length === 0;
    });
};
reservationSchema.statics.calculateTotalAmount = function (listingId, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const listing = yield listings_1.Listing.findById(listingId);
        if (!listing) {
            throw new errors_1.NotFoundError('Listing not found');
        }
        const nights = Math.ceil(new Date(endDate).getDate() - new Date(startDate).getDate());
        const baseAmount = (Number(listing.price.basePrice) +
            Number(listing.price.cleaningFee) +
            Number(listing.price.serviceFee)) *
            nights;
        return baseAmount;
    });
};
const Reservation = mongoose_1.default.model('Reservation', reservationSchema);
exports.Reservation = Reservation;
