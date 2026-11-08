"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getSinglePost = exports.createPost = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../common/utils");
const createPost = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            content: zod_1.z.string().trim().min(1),
        }),
    });
};
exports.createPost = createPost;
const getSinglePost = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            postId: utils_1.generalValidationFields.id(lang),
        }),
    });
};
exports.getSinglePost = getSinglePost;
const updatePost = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            postId: utils_1.generalValidationFields.id(lang),
        }),
        body: zod_1.z.strictObject({
            content: zod_1.z.string().trim().min(1),
        }),
    });
};
exports.updatePost = updatePost;
const deletePost = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            postId: utils_1.generalValidationFields.id(lang),
        }),
    });
};
exports.deletePost = deletePost;
