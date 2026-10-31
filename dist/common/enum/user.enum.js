"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileVisibilityEnum = exports.TwoStepVerificationEnum = exports.ProviderEnum = exports.RoleEnum = exports.GenderEnum = void 0;
var GenderEnum;
(function (GenderEnum) {
    GenderEnum[GenderEnum["MALE"] = 0] = "MALE";
    GenderEnum[GenderEnum["FEMALE"] = 1] = "FEMALE";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var RoleEnum;
(function (RoleEnum) {
    RoleEnum[RoleEnum["USER"] = 0] = "USER";
    RoleEnum[RoleEnum["ADMIN"] = 1] = "ADMIN";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var ProviderEnum;
(function (ProviderEnum) {
    ProviderEnum[ProviderEnum["SYSTEM"] = 0] = "SYSTEM";
    ProviderEnum[ProviderEnum["GOOGLE"] = 1] = "GOOGLE";
})(ProviderEnum || (exports.ProviderEnum = ProviderEnum = {}));
var TwoStepVerificationEnum;
(function (TwoStepVerificationEnum) {
    TwoStepVerificationEnum[TwoStepVerificationEnum["DISABLED"] = 0] = "DISABLED";
    TwoStepVerificationEnum[TwoStepVerificationEnum["ENABLED"] = 1] = "ENABLED";
})(TwoStepVerificationEnum || (exports.TwoStepVerificationEnum = TwoStepVerificationEnum = {}));
var ProfileVisibilityEnum;
(function (ProfileVisibilityEnum) {
    ProfileVisibilityEnum[ProfileVisibilityEnum["PUBLIC"] = 0] = "PUBLIC";
    ProfileVisibilityEnum[ProfileVisibilityEnum["PRIVATE"] = 1] = "PRIVATE";
})(ProfileVisibilityEnum || (exports.ProfileVisibilityEnum = ProfileVisibilityEnum = {}));
