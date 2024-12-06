"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    icon: { type: String, required: true },
    name: { type: String, required: true },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
        versionKey: false,
    },
});
categorySchema.statics.build = (attrs) => {
    return new Category(attrs);
};
const Category = mongoose_1.default.model('Category', categorySchema);
exports.Category = Category;
