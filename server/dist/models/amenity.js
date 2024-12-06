"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amenity = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const amenitySchema = new mongoose_1.default.Schema({
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
amenitySchema.statics.build = (attrs) => {
    return new Amenity(attrs);
};
const Amenity = mongoose_1.default.model('Amenity', amenitySchema);
exports.Amenity = Amenity;
