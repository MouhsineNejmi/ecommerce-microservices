"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const errors_1 = require("../errors");
const requireAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        throw new errors_1.UnauthorizedError('Not authorized');
    }
    next();
};
exports.requireAdmin = requireAdmin;
