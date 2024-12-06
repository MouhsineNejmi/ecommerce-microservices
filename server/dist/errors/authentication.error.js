"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = void 0;
const custom_error_1 = require("./custom.error");
class AuthenticationError extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 401;
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message || 'Authentication Failed' }];
    }
}
exports.AuthenticationError = AuthenticationError;
