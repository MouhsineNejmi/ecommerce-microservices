"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
class AuthService {
    static generateTokens(id, role) {
        const accessToken = jsonwebtoken_1.default.sign({ id, role }, config_1.default.jwt.accessToken.secret, {
            expiresIn: config_1.default.jwt.accessToken.expiresIn,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id, role }, config_1.default.jwt.refreshToken.secret, { expiresIn: config_1.default.jwt.refreshToken.expiresIn });
        return { accessToken, refreshToken };
    }
    static validateRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt.refreshToken.secret);
                return decoded.id ? decoded : null;
            }
            catch (error) {
                return null;
            }
        });
    }
    static extractToken(req) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        }
        if (req.cookies && req.cookies.accessToken) {
            return req.cookies.accessToken;
        }
        return null;
    }
}
exports.AuthService = AuthService;
