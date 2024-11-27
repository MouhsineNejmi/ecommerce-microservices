import { body } from 'express-validator';

export const validateCategoryAmenity = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Name can only contain alphanumeric characters'),
  body('icon')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Icon must be between 2 and 50 characters'),
];
