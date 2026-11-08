"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getSingleComment = exports.getPostComments = exports.createComment = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../common/utils");
const createComment = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            postId: utils_1.generalValidationFields.id(lang),
        }),
        body: zod_1.z.strictObject({
            content: zod_1.z.string().trim().min(1),
        }),
    });
};
exports.createComment = createComment;
const getPostComments = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            postId: utils_1.generalValidationFields.id(lang),
        }),
    });
};
exports.getPostComments = getPostComments;
const getSingleComment = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            commentId: utils_1.generalValidationFields.id(lang),
        }),
    });
};
exports.getSingleComment = getSingleComment;
const updateComment = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            commentId: utils_1.generalValidationFields.id(lang),
        }),
        body: zod_1.z.strictObject({
            content: zod_1.z.string().trim().min(1),
        }),
    });
};
exports.updateComment = updateComment;
const deleteComment = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            commentId: utils_1.generalValidationFields.id(lang),
        }),
    });
};
exports.deleteComment = deleteComment;
