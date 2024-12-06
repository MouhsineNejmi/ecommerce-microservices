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
const express_1 = __importDefault(require("express"));
const validator_middleware_1 = require("../middlewares/validator.middleware");
const current_user_middleware_1 = require("../middlewares/current-user.middleware");
const require_auth_middleware_1 = require("../middlewares/require-auth.middleware");
const security_middleware_1 = require("../middlewares/security.middleware");
const errors_1 = require("../errors");
const password_service_1 = require("../services/password.service");
const auth_service_1 = require("../services/auth.service");
const async_handler_1 = require("../utils/async-handler");
const cookies_1 = require("../utils/cookies");
const user_1 = require("../models/user");
const user_validation_1 = require("../validations/user.validation");
const listings_1 = require("../models/listings");
const router = express_1.default.Router();
router.post('/register', user_validation_1.registerValidation, validator_middleware_1.validate, (0, async_handler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    const userExists = yield user_1.User.findOne({ email }).select('-password');
    if (userExists) {
        throw new errors_1.ConflictError('User already exists');
    }
    const user = yield user_1.User.create({
        name,
        email,
        password,
        role,
    });
    const tokens = auth_service_1.AuthService.generateTokens(user.id, user.role);
    (0, cookies_1.setTokenCookies)(res, tokens);
    return res.status(201).json({
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: tokens.accessToken,
        },
    });
})));
router.post('/login', user_validation_1.loginValidation, validator_middleware_1.validate, security_middleware_1.securityMiddleware.loginLimiter, (0, async_handler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.User.findOne({ email }).select('+password');
    if (!user || !(yield password_service_1.Password.compare(user.password, password))) {
        throw new errors_1.BadRequestError('Invalid Credentials');
    }
    const tokens = auth_service_1.AuthService.generateTokens(user.id, user.role);
    (0, cookies_1.setTokenCookies)(res, tokens);
    return res.json({
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: tokens.accessToken,
        },
    });
})));
router.use(current_user_middleware_1.currentUser);
router.post('/refresh-token', require_auth_middleware_1.requireAuth, (0, async_handler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new errors_1.UnauthorizedError('Refresh token required');
    }
    const decoded = yield auth_service_1.AuthService.validateRefreshToken(refreshToken);
    if (!decoded) {
        throw new errors_1.UnauthorizedError('Invalid refresh token');
    }
    const tokens = auth_service_1.AuthService.generateTokens(decoded.id, decoded.role);
    (0, cookies_1.setTokenCookies)(res, tokens);
    return res.json({
        data: {
            accessToken: tokens.accessToken,
        },
    });
})));
router.post('/logout', require_auth_middleware_1.requireAuth, (0, async_handler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logout successful' });
})));
router.get('/me', require_auth_middleware_1.requireAuth, (0, async_handler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select('-password');
    return res.json({ data: user });
})));
router.get('/favorites', (0, async_handler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const user = yield user_1.User.findById(userId).populate('favorites');
    return res.json({ data: (user === null || user === void 0 ? void 0 : user.favorites) || [] });
})));
router.post('/favorites/:listingId', (0, async_handler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { listingId } = req.params;
    const user = yield user_1.User.findById(userId);
    const listing = yield listings_1.Listing.findById(listingId);
    if (!user) {
        throw new errors_1.NotFoundError('User not found');
    }
    if (!listing) {
        throw new errors_1.NotFoundError('Listing not found');
    }
    if (!((_b = user.favorites) === null || _b === void 0 ? void 0 : _b.includes(listing.id))) {
        (_c = user === null || user === void 0 ? void 0 : user.favorites) === null || _c === void 0 ? void 0 : _c.push(listing.id);
        yield user.save();
    }
    return res.json({ data: (user === null || user === void 0 ? void 0 : user.favorites) || [] });
})));
router.delete('/favorites/:listingId', (0, async_handler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { listingId } = req.params;
    const user = yield user_1.User.findById(userId);
    if (!user) {
        throw new errors_1.NotFoundError('User not found');
    }
    user.favorites = (_b = user.favorites) === null || _b === void 0 ? void 0 : _b.filter((id) => id.toString() !== listingId);
    yield user.save();
    return res.json({ data: (user === null || user === void 0 ? void 0 : user.favorites) || [] });
})));
exports.default = router;
