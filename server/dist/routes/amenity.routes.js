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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const async_handler_1 = require("../utils/async-handler");
const amenity_1 = require("../models/amenity");
const category_amenity_validation_1 = require("../validations/category-amenity.validation");
const require_auth_middleware_1 = require("../middlewares/require-auth.middleware");
const require_admin_middleware_1 = require("../middlewares/require-admin.middleware");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const current_user_middleware_1 = require("../middlewares/current-user.middleware");
const errors_1 = require("../errors");
const router = (0, express_1.Router)();
router.use(current_user_middleware_1.currentUser);
router.get('/', require_auth_middleware_1.requireAuth, require_admin_middleware_1.requireAdmin, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, search = '', sortBy = 'name', sortOrder = 'asc', } = req.query;
    const searchQuery = search
        ? { name: { $regex: search, $options: 'i' } }
        : {};
    const sortOptions = {
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
    const amenities = yield amenity_1.Amenity.find(searchQuery)
        .sort(sortOptions)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    const total = yield amenity_1.Amenity.countDocuments(searchQuery);
    return res.json({
        data: amenities,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(Number(total) / Number(limit)),
            total,
        },
    });
})));
router.get('/:id', (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const amenity = yield amenity_1.Amenity.findById(req.params.id);
    if (!amenity) {
        throw new errors_1.NotFoundError('Amenity not found');
    }
    return res.json({ data: amenity });
})));
router.post('/', require_auth_middleware_1.requireAuth, require_admin_middleware_1.requireAdmin, category_amenity_validation_1.createCategoryAmenity, validator_middleware_1.validate, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, icon } = req.body;
    const existingAmenity = yield amenity_1.Amenity.findOne({ name });
    if (existingAmenity) {
        throw new errors_1.ConflictError('Amenity already exists');
    }
    const amenity = amenity_1.Amenity.build({
        name,
        icon,
    });
    yield amenity.save();
    return res.status(201).json({
        data: amenity,
    });
})));
router.put('/:id', require_auth_middleware_1.requireAuth, require_admin_middleware_1.requireAdmin, category_amenity_validation_1.updateCategoryAmenity, validator_middleware_1.validate, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const amenity = yield amenity_1.Amenity.findById(req.params.id);
    if (!amenity) {
        throw new errors_1.NotFoundError('Amenity not found');
    }
    const { name, icon } = req.body;
    Object.keys({ name, icon }).forEach((key) => {
        amenity.set(key, req.body[key]);
    });
    yield amenity.save();
    return res.status(200).json({ data: amenity });
})));
router.delete('/:id', require_auth_middleware_1.requireAuth, require_admin_middleware_1.requireAdmin, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const amenity = yield amenity_1.Amenity.findByIdAndDelete(req.params.id);
    if (!amenity) {
        throw new errors_1.NotFoundError('Amenity not found');
    }
    return res.status(200).json({
        message: 'Amenity deleted successfully',
    });
})));
exports.default = router;
