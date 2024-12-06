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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const listings_1 = require("../models/listings");
const async_handler_1 = require("../utils/async-handler");
const require_auth_middleware_1 = require("../middlewares/require-auth.middleware");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const current_user_middleware_1 = require("../middlewares/current-user.middleware");
const errors_1 = require("../errors");
const listing_validation_1 = require("../validations/listing.validation");
const category_1 = require("../models/category");
const deep_merge_1 = require("../utils/deep-merge");
// import { Reservation } from '../models/reservations';
const router = express_1.default.Router();
const buildFilterQuery = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (queryParams.status) {
        filter.status = queryParams.status;
    }
    if (queryParams.minPrice || queryParams.maxPrice) {
        filter['price.basePrice'] = Object.assign(Object.assign({}, (queryParams.minPrice && { $gte: Number(queryParams.minPrice) })), (queryParams.maxPrice && { $lte: Number(queryParams.maxPrice) }));
    }
    const numericFilters = [
        { key: 'baths', filterKey: 'baths' },
        { key: 'bedrooms', filterKey: 'bedrooms' },
        { key: 'beds', filterKey: 'beds' },
        { key: 'maxGuests', filterKey: 'maxGuests' },
    ];
    numericFilters.forEach(({ key, filterKey }) => {
        if (queryParams[key]) {
            filter[filterKey] = {
                $gte: Number(queryParams[key]),
            };
        }
    });
    if (queryParams.city) {
        filter['location.city'] = queryParams.city;
    }
    if (queryParams.country) {
        filter['location.country'] = queryParams.country;
    }
    if (queryParams.category) {
        const category = yield category_1.Category.findOne({
            name: {
                $regex: new RegExp('^' + queryParams.category.toLowerCase(), 'i'),
            },
        });
        if (category) {
            filter.category = category._id;
        }
    }
    if (queryParams.search) {
        filter.$or = [
            { title: { $regex: new RegExp(queryParams.search, 'i') } },
            {
                description: { $regex: new RegExp(queryParams.search, 'i') },
            },
            {
                'location.city': {
                    $regex: new RegExp(queryParams.search, 'i'),
                },
            },
            {
                'location.country': {
                    $regex: new RegExp(queryParams.search, 'i'),
                },
            },
        ];
    }
    if (queryParams.hostId) {
        filter.host = queryParams.hostId;
    }
    return filter;
});
router.get('/', (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, page = 1 } = req.params;
    const filter = yield buildFilterQuery(req.query);
    const listings = yield listings_1.Listing.find(filter)
        .limit(Number(filter.limit))
        .skip((Number(filter.page) - 1) * Number(filter.limit))
        .sort({ createdAt: -1 })
        .populate('amenities', 'icon name')
        .populate('category', 'id icon name');
    const total = yield listings_1.Listing.countDocuments(filter);
    return res.status(200).json({
        data: listings,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            total,
        },
    });
})));
router.get('/:id', (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const listing = yield listings_1.Listing.findById(id)
        .populate('amenities', 'icon name')
        .populate('category', 'id name icon')
        .populate('host', 'id name avatar');
    if (!listing) {
        throw new errors_1.NotFoundError('Listing not found');
    }
    return res.status(200).json({ data: listing });
})));
router.use(current_user_middleware_1.currentUser);
router.post('/', require_auth_middleware_1.requireAuth, listing_validation_1.createListingValidation, validator_middleware_1.validate, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listingData = Object.assign(Object.assign({}, req.body), { host: req.user.id });
    const listing = listings_1.Listing.build(listingData);
    yield listing.save();
    return res.status(201).json({ data: listing });
})));
router.put('/:id', require_auth_middleware_1.requireAuth, listing_validation_1.updateListingValidation, validator_middleware_1.validate, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: listingId } = req.params;
    const { id: userId, role } = req.user;
    const _a = req.body, { host } = _a, updateData = __rest(_a, ["host"]);
    let listing;
    if (role === 'admin') {
        listing = yield listings_1.Listing.findById(req.params.id, updateData);
    }
    else {
        listing = yield listings_1.Listing.findOneAndUpdate({
            id: listingId,
            host: userId,
        });
    }
    if (!listing) {
        throw new errors_1.NotFoundError('Listing not found');
    }
    const updatedListingData = (0, deep_merge_1.deepMerge)(listing.toObject(), updateData);
    listing = yield listings_1.Listing.findByIdAndUpdate(listingId, updatedListingData, {
        new: true,
    });
    return res.status(200).json({ data: listing });
})));
router.delete('/:id', require_auth_middleware_1.requireAuth, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: listingId } = req.params;
    const { id: userId, role } = req.user;
    let listing;
    if (role === 'admin') {
        listing = yield listings_1.Listing.findByIdAndDelete(listingId);
    }
    else {
        listing = yield listings_1.Listing.findOneAndDelete({
            id: listingId,
            host: userId,
        });
    }
    if (!listing) {
        throw new errors_1.NotFoundError('Listing not found');
    }
    return res.status(200).json({ message: 'Listing deleted successfully' });
})));
exports.default = router;
