"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listing = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var ListingStatus;
(function (ListingStatus) {
    ListingStatus["DRAFT"] = "draft";
    ListingStatus["PUBLISHED"] = "published";
    ListingStatus["ARCHIVED"] = "archived";
})(ListingStatus || (ListingStatus = {}));
const listingSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
    },
    price: {
        basePrice: { type: Number, required: true },
        cleaningFee: { type: Number, default: 0 },
        serviceFee: { type: Number, default: 0 },
    },
    images: [{ url: String, caption: String }],
    amenities: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Amenity', required: true },
    ],
    host: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ListingStatus,
        default: ListingStatus.DRAFT,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    maxGuests: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
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
listingSchema.statics.build = (attrs) => {
    return new Listing(attrs);
};
const Listing = mongoose_1.default.model('Listing', listingSchema);
exports.Listing = Listing;
