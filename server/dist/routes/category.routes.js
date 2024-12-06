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
const category_1 = require("../models/category");
const category_amenity_validation_1 = require("../validations/category-amenity.validation");
const current_user_middleware_1 = require("../middlewares/current-user.middleware");
const require_auth_middleware_1 = require("../middlewares/require-auth.middleware");
const require_admin_middleware_1 = require("../middlewares/require-admin.middleware");
const validator_middleware_1 = require("../middlewares/validator.middleware");
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
    const categories = yield category_1.Category.find(searchQuery)
        .sort(sortOptions)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    const total = yield category_1.Category.countDocuments(searchQuery);
    return res.json({
        data: categories,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(Number(total) / Number(limit)),
            total: total,
        },
    });
})));
router.get('/:id', (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.Category.findById(req.params.id);
    if (!category) {
        throw new errors_1.NotFoundError('Category not found');
    }
    return res.json({ data: category });
})));
router.post('/', require_auth_middleware_1.requireAuth, require_admin_middleware_1.requireAdmin, category_amenity_validation_1.createCategoryAmenity, validator_middleware_1.validate, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, icon } = req.body;
    const existingCategory = yield category_1.Category.findOne({ name });
    if (existingCategory) {
        throw new errors_1.ConflictError('Category already exists');
    }
    const category = category_1.Category.build({
        name,
        icon,
    });
    yield category.save();
    return res.status(201).json({
        data: category,
    });
})));
router.put('/:id', require_auth_middleware_1.requireAuth, require_admin_middleware_1.requireAdmin, category_amenity_validation_1.updateCategoryAmenity, validator_middleware_1.validate, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.Category.findById(req.params.id);
    if (!category) {
        throw new errors_1.NotFoundError('Category not found');
    }
    const { name, icon } = req.body;
    Object.keys({ name, icon }).forEach((key) => {
        category.set(key, req.body[key]);
    });
    yield category.save();
    return res.status(200).json({ data: category });
})));
router.delete('/:id', require_auth_middleware_1.requireAuth, require_admin_middleware_1.requireAdmin, (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.Category.findByIdAndDelete(req.params.id);
    if (!category) {
        throw new errors_1.NotFoundError('Category not found');
    }
    return res.status(200).json({
        message: 'Category deleted successfully',
    });
})));
exports.default = router;
