import { body, ValidationChain } from 'express-validator';
import mongoose from 'mongoose';

export const createReservationValidation: ValidationChain[] = [
  body('listingId')
    .notEmpty()
    .withMessage('Listing ID is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid listing ID format'),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .custom((value) => new Date(value) > new Date())
    .withMessage('Start date must be in the future'),

  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => new Date(value) > new Date(req.body.startDate))
    .withMessage('End date must be after start date'),

  body('guestCount')
    .notEmpty()
    .withMessage('Guest count is required')
    .isInt({ gt: 0 })
    .withMessage('Guest count must be greater than 0'),
];

export const updateReservationValidation: ValidationChain[] = [
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required')
    .custom((endDate, { req }) => {
      if (
        endDate &&
        req.body.startDate &&
        new Date(endDate) <= new Date(req.body.startDate)
      ) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('guestCount')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Guest count must be at least 1'),
];
