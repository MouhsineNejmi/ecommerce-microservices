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
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const listings_routes_1 = __importDefault(require("./routes/listings.routes"));
const reservations_routes_1 = __importDefault(require("./routes/reservations.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const amenity_routes_1 = __importDefault(require("./routes/amenity.routes"));
const security_middleware_1 = require("./middlewares/security.middleware");
const error_handler_middleware_1 = require("./middlewares/error-handler.middleware");
const errors_1 = require("./errors");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const allowedOrigins = process.env.ALLOWED_ORIGINS;
app.use((0, body_parser_1.json)());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: allowedOrigins === null || allowedOrigins === void 0 ? void 0 : allowedOrigins.split(','), credentials: true }));
app.set('trust proxy', 1);
app.use(security_middleware_1.securityMiddleware.securityHeaders);
// app.use(securityMiddleware.rateLimiter);
app.use('/api/users', user_routes_1.default);
app.use('/api/listings', listings_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/amenities', amenity_routes_1.default);
app.use('/api/reservations', reservations_routes_1.default);
app.all('*', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    next(new errors_1.NotFoundError('API Route Not Found.'));
}));
app.use((err, req, res, next) => {
    (0, error_handler_middleware_1.errorHandler)(err, req, res, next);
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
        throw new errors_1.BadRequestError('JWT_ACCESS_TOKEN_SECRET not defined');
    }
    if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
        throw new errors_1.BadRequestError('JWT_REFRESH_TOKEN_SECRET not defined');
    }
    if (!process.env.MONGO_URI) {
        throw new errors_1.BadRequestError('MONGO_URI not defined');
    }
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('[server]: Connected To MongoDB');
    }
    catch (error) {
        console.error(error);
        throw new errors_1.DatabaseConnectionError();
    }
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});
start();
