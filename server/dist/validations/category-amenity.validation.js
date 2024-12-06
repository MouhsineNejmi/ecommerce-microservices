"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryAmenity = exports.createCategoryAmenity = void 0;
const express_validator_1 = require("express-validator");
exports.createCategoryAmenity = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('icon')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Icon must be at least 2 characters'),
];
exports.updateCategoryAmenity = [
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('icon')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Icon must be at least 2 characters'),
];
