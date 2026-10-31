import { z } from "zod";
import { generalValidationFields } from "../../common/utils";
import { LanguageEnum, GenderEnum, ProfileVisibilityEnum } from "../../common/enum";

// Validation schema for updating user profile
export const updateProfile = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            firstName: z.string().min(2).max(25).optional(),
            lastName: z.string().min(2).max(25).optional(),
            phone: generalValidationFields.phone(lang).optional(),
            DOB: z.string().date().optional(),
            gender: z.nativeEnum(GenderEnum).optional(),
        })
    });
};

// Validation schema for following a user
export const followUser = (lang: LanguageEnum) => {
    return z.object({
        params: z.strictObject({
            userId: generalValidationFields.id(lang),
        })
    });
};

// Validation schema for unfollowing a user
export const unfollowUser = (lang: LanguageEnum) => {
    return z.object({
        params: z.strictObject({
            userId: generalValidationFields.id(lang),
        })
    });
};

// Validation schema for searching users
export const searchUsers = (lang: LanguageEnum) => {
    return z.object({
        query: z.object({
            q: z.string().min(1),
            page: z.coerce.number().int().min(1).optional(),
            limit: z.coerce.number().int().min(1).max(50).optional(),
        })
    });
};

// Validation schema for updating account settings
export const updateSettings = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            profileVisibility: z.nativeEnum(ProfileVisibilityEnum).optional(),
        })
    });
};


