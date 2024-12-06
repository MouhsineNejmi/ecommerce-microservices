"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateListingValidation = exports.createListingValidation = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
exports.createListingValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 10, max: 100 })
        .withMessage('Title must be between 10 and 100 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 20, max: 1000 })
        .withMessage('Description must be between 20 and 1000 characters'),
    (0, express_validator_1.body)('location')
        .notEmpty()
        .withMessage('Location is required')
        .isObject()
        .withMessage('Location must be an object'),
    (0, express_validator_1.body)('location.address')
        .trim()
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ min: 5, max: 100 })
        .withMessage('Address must be between 5 and 100 characters'),
    (0, express_validator_1.body)('location.city')
        .trim()
        .notEmpty()
        .withMessage('City is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('City must be between 2 and 50 characters'),
    (0, express_validator_1.body)('location.state')
        .trim()
        .notEmpty()
        .withMessage('State is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('State must be between 2 and 50 characters'),
    (0, express_validator_1.body)('location.country')
        .trim()
        .notEmpty()
        .withMessage('Country is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Country must be between 2 and 50 characters'),
    (0, express_validator_1.body)('location.coordinates')
        .notEmpty()
        .withMessage('Coordinates are required')
        .isObject()
        .withMessage('Coordinates must be an object'),
    (0, express_validator_1.body)('location.coordinates.lat')
        .notEmpty()
        .withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),
    (0, express_validator_1.body)('location.coordinates.lng')
        .notEmpty()
        .withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),
    (0, express_validator_1.body)('price').notEmpty().withMessage('Price is required'),
    (0, express_validator_1.body)('price.basePrice')
        .notEmpty()
        .withMessage('Base price is required')
        .isFloat({ min: 5 })
        .withMessage('Base price must be at least 5 dollars'),
    (0, express_validator_1.body)('price.cleaningFee')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Cleaning fee must be a positive number'),
    (0, express_validator_1.body)('price.serviceFee')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Service fee must be a positive number'),
    (0, express_validator_1.body)('images').isArray().withMessage('Images must be an array').optional(),
    (0, express_validator_1.body)('images.*.url')
        .if((0, express_validator_1.body)('images').exists())
        .notEmpty()
        .withMessage('Image URL is required')
        .isURL()
        .withMessage('Invalid image URL'),
    (0, express_validator_1.body)('images.*.caption')
        .if((0, express_validator_1.body)('images').exists())
        .optional()
        .isString()
        .withMessage('Image caption must be a string')
        .isLength({ max: 100 })
        .withMessage('Image caption must not exceed 100 characters'),
    (0, express_validator_1.body)('amenities').isArray().withMessage('Amenities must be an array'),
    (0, express_validator_1.body)('amenities.*')
        .custom((value) => mongoose_1.default.Types.ObjectId.isValid(value))
        .withMessage('Invalid amenity ID format'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['draft', 'published', 'archived'])
        .withMessage('Invalid status value'),
    (0, express_validator_1.body)('category')
        .notEmpty()
        .withMessage('Category is required')
        .custom((value) => mongoose_1.default.Types.ObjectId.isValid(value))
        .withMessage('Invalid category ID format'),
    (0, express_validator_1.body)('maxGuests')
        .notEmpty()
        .withMessage('Maximum number of guests is required')
        .isInt({ min: 1, max: 50 })
        .withMessage('Maximum guests must be between 1 and 50'),
    (0, express_validator_1.body)('bedrooms')
        .notEmpty()
        .withMessage('Number of bedrooms is required')
        .isInt({ min: 1, max: 50 })
        .withMessage('Number of bedrooms must be between 0 and 50'),
    (0, express_validator_1.body)('beds')
        .notEmpty()
        .withMessage('Number of beds is required')
        .isInt({ min: 1, max: 50 })
        .withMessage('Number of beds must be between 1 and 50'),
    (0, express_validator_1.body)('baths')
        .notEmpty()
        .withMessage('Number of bathrooms is required')
        .isFloat({ min: 1, max: 50 })
        .withMessage('Number of bathrooms must be between 0.5 and 50'),
];
exports.updateListingValidation = [
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 10, max: 100 })
        .withMessage('Title must be between 10 and 100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 20, max: 1000 })
        .withMessage('Description must be between 20 and 1000 characters'),
    (0, express_validator_1.body)('location')
        .optional()
        .isObject()
        .withMessage('Location must be an object'),
    (0, express_validator_1.body)('location.address')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ min: 5, max: 100 })
        .withMessage('Address must be between 5 and 100 characters'),
    (0, express_validator_1.body)('location.city')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('City is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('City must be between 2 and 50 characters'),
    (0, express_validator_1.body)('location.state')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('State is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('State must be between 2 and 50 characters'),
    (0, express_validator_1.body)('location.country')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Country is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Country must be between 2 and 50 characters'),
    (0, express_validator_1.body)('location.coordinates')
        .optional()
        .isObject()
        .withMessage('Coordinates must be an object'),
    (0, express_validator_1.body)('location.coordinates.lat')
        .optional()
        .notEmpty()
        .withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),
    (0, express_validator_1.body)('location.coordinates.lng')
        .optional()
        .notEmpty()
        .withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),
    (0, express_validator_1.body)('price').optional().isObject().withMessage('Price must be an object'),
    (0, express_validator_1.body)('price.basePrice')
        .optional()
        .notEmpty()
        .withMessage('Base price is required')
        .isFloat({ min: 0 })
        .withMessage('Base price must be a positive number'),
    (0, express_validator_1.body)('price.cleaningFee')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Cleaning fee must be a positive number'),
    (0, express_validator_1.body)('price.serviceFee')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Service fee must be a positive number'),
    (0, express_validator_1.body)('images').optional().isArray().withMessage('Images must be an array'),
    (0, express_validator_1.body)('images.*.url')
        .optional()
        .notEmpty()
        .withMessage('Image URL is required')
        .isURL()
        .withMessage('Invalid image URL'),
    (0, express_validator_1.body)('images.*.caption')
        .optional()
        .isString()
        .withMessage('Image caption must be a string')
        .isLength({ max: 100 })
        .withMessage('Image caption must not exceed 100 characters'),
    (0, express_validator_1.body)('amenities')
        .optional()
        .isArray()
        .withMessage('Amenities must be an array'),
    (0, express_validator_1.body)('amenities.*')
        .optional()
        .custom((value) => mongoose_1.default.Types.ObjectId.isValid(value))
        .withMessage('Invalid amenity ID format'),
    (0, express_validator_1.body)('maxGuests')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Maximum guests must be between 1 and 50'),
    (0, express_validator_1.body)('bedrooms')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('Number of bedrooms must be between 0 and 50'),
    (0, express_validator_1.body)('beds')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Number of beds must be between 1 and 50'),
    (0, express_validator_1.body)('baths')
        .optional()
        .isFloat({ min: 0.5, max: 50 })
        .withMessage('Number of bathrooms must be between 0.5 and 50'),
];
