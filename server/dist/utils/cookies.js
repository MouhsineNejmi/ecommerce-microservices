"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTokenCookies = void 0;
const setTokenCookies = (res, tokens) => {
    res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
exports.setTokenCookies = setTokenCookies;
