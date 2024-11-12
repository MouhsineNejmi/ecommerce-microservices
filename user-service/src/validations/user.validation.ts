import { body } from 'express-validator';

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password').trim().notEmpty().withMessage('Password is required'),
];

export const addressValidation = [
  body('street')
    .trim()
    .notEmpty()
    .withMessage('Street is required')
    .isLength({ max: 100 })
    .withMessage('Street cannot exceed 100 characters'),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 50 })
    .withMessage('City cannot exceed 50 characters'),

  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ max: 50 })
    .withMessage('State cannot exceed 50 characters'),

  body('zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required')
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Please provide a valid zip code'),

  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 50 })
    .withMessage('Country cannot exceed 50 characters'),

  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean value'),
];
