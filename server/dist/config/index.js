"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    jwt: {
        accessToken: {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: '7d',
        },
        refreshToken: {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: '7d',
        },
    },
    security: {
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60,
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
    },
};
exports.default = config;
