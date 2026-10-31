"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.searchUsers = exports.unfollowUser = exports.followUser = exports.updateProfile = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../common/utils");
const enum_1 = require("../../common/enum");
const updateProfile = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            firstName: zod_1.z.string().min(2).max(25).optional(),
            lastName: zod_1.z.string().min(2).max(25).optional(),
            phone: utils_1.generalValidationFields.phone(lang).optional(),
            DOB: zod_1.z.string().date().optional(),
            gender: zod_1.z.nativeEnum(enum_1.GenderEnum).optional(),
        })
    });
};
exports.updateProfile = updateProfile;
const followUser = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            userId: utils_1.generalValidationFields.id(lang),
        })
    });
};
exports.followUser = followUser;
const unfollowUser = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            userId: utils_1.generalValidationFields.id(lang),
        })
    });
};
exports.unfollowUser = unfollowUser;
const searchUsers = (lang) => {
    return zod_1.z.object({
        query: zod_1.z.object({
            q: zod_1.z.string().min(1),
            page: zod_1.z.coerce.number().int().min(1).optional(),
            limit: zod_1.z.coerce.number().int().min(1).max(50).optional(),
        })
    });
};
exports.searchUsers = searchUsers;
const updateSettings = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            profileVisibility: zod_1.z.nativeEnum(enum_1.ProfileVisibilityEnum).optional(),
        })
    });
};
exports.updateSettings = updateSettings;
