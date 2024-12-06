"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMerge = void 0;
const deepMerge = (existing, update) => {
    const result = Object.assign({}, existing);
    Object.keys(update).forEach((key) => {
        if (typeof update[key] === 'object' && update[key] !== null) {
            if (Array.isArray(update[key])) {
                // For arrays, replace entirely
                result[key] = update[key];
            }
            else {
                // For nested objects, recursively merge
                result[key] =
                    result[key] && typeof result[key] === 'object'
                        ? (0, exports.deepMerge)(result[key], update[key])
                        : update[key];
            }
        }
        else {
            // For primitive values, replace
            result[key] = update[key];
        }
    });
    return result;
};
exports.deepMerge = deepMerge;
