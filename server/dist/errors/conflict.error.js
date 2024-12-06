"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
const custom_error_1 = require("./custom.error");
class ConflictError extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 409;
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message || 'Conflict Error' }];
    }
}
exports.ConflictError = ConflictError;
