"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityMiddleware = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
exports.securityMiddleware = {
    rateLimiter: (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 min
        max: 100, // limit each IP to 100 requests by windowMs
        message: 'Too many requests from this IP, please try again later.',
    }),
    loginLimiter: (0, express_rate_limit_1.default)({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 5,
        message: 'Too many login attempts, please try again later.',
    }),
    securityHeaders: [
        (0, helmet_1.default)(),
        helmet_1.default.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        }),
    ],
};
