"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const currentUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if ((authHeader && !authHeader.startsWith('Bearer ')) ||
        !req.cookies ||
        !req.cookies.accessToken) {
        next();
    }
    try {
        const payload = jsonwebtoken_1.default.verify(req.cookies.accessToken, config_1.default.jwt.accessToken.secret);
        req.user = payload;
    }
    catch (err) { }
    next();
};
exports.currentUser = currentUser;
