"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReservationValidation = exports.createReservationValidation = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
exports.createReservationValidation = [
    (0, express_validator_1.body)('listingId')
        .notEmpty()
        .withMessage('Listing ID is required')
        .custom((value) => mongoose_1.default.Types.ObjectId.isValid(value))
        .withMessage('Invalid listing ID format'),
    (0, express_validator_1.body)('startDate')
        .notEmpty()
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Start date must be a valid date')
        .custom((value) => new Date(value) > new Date())
        .withMessage('Start date must be in the future'),
    (0, express_validator_1.body)('endDate')
        .notEmpty()
        .withMessage('End date is required')
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((value, { req }) => new Date(value) > new Date(req.body.startDate))
        .withMessage('End date must be after start date'),
    (0, express_validator_1.body)('guestCount')
        .notEmpty()
        .withMessage('Guest count is required')
        .isInt({ gt: 0 })
        .withMessage('Guest count must be greater than 0'),
];
exports.updateReservationValidation = [
    (0, express_validator_1.body)('startDate')
        .optional()
        .isISO8601()
        .withMessage('Valid start date is required'),
    (0, express_validator_1.body)('endDate')
        .optional()
        .isISO8601()
        .withMessage('Valid end date is required')
        .custom((endDate, { req }) => {
        if (endDate &&
            req.body.startDate &&
            new Date(endDate) <= new Date(req.body.startDate)) {
            throw new Error('End date must be after start date');
        }
        return true;
    }),
    (0, express_validator_1.body)('guestCount')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Guest count must be at least 1'),
];
