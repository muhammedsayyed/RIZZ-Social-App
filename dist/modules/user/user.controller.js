"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const authentication_middleware_1 = __importDefault(require("../../middleware/authentication.middleware"));
const enum_1 = require("../../common/enum");
const middleware_1 = require("../../middleware");
const validators = __importStar(require("./user.validation"));
const router = (0, express_1.Router)({ strict: true, caseSensitive: true });
router.post("/rotate-token", authentication_middleware_1.default.authentication(enum_1.TokenTypeEnum.ACCESS), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await user_service_1.default.rotateToken(req.payload, req.user, `${req.protocol}://${req.host}`);
    return { data, status: 200 };
}));
router.post("/logout", authentication_middleware_1.default.authentication(), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    await user_service_1.default.logout(req.payload, req.user, req.body);
    return { data: { message: "Logged out successfully" }, status: 200 };
}));
router.get("/profile", authentication_middleware_1.default.authentication(), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await user_service_1.default.getProfile(req.user);
    return { data, status: 200 };
}));
router.patch("/profile", authentication_middleware_1.default.authentication(), (0, middleware_1.validation)(validators.updateProfile), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await user_service_1.default.updateProfile(req.user, req.validate.body);
    return { data, status: 200 };
}));
router.post("/follow/:userId", authentication_middleware_1.default.authentication(), (0, middleware_1.validation)(validators.followUser), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await user_service_1.default.followUser(req.user, req.validate.params.userId);
    return { data, status: 200 };
}));
router.delete("/unfollow/:userId", authentication_middleware_1.default.authentication(), (0, middleware_1.validation)(validators.unfollowUser), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await user_service_1.default.unfollowUser(req.user, req.validate.params.userId);
    return { data, status: 200 };
}));
router.get("/search", authentication_middleware_1.default.authentication(), (0, middleware_1.validation)(validators.searchUsers), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const { q, page, limit } = req.validate.query;
    const data = await user_service_1.default.searchUsers(q, req.user._id, page, limit);
    return { data, status: 200 };
}));
router.get("/suggestions", authentication_middleware_1.default.authentication(), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const data = await user_service_1.default.getSuggestions(req.user, page, limit);
    return { data, status: 200 };
}));
router.get("/settings", authentication_middleware_1.default.authentication(), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await user_service_1.default.getSettings(req.user);
    return { data, status: 200 };
}));
router.patch("/settings", authentication_middleware_1.default.authentication(), (0, middleware_1.validation)(validators.updateSettings), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await user_service_1.default.updateSettings(req.user, req.validate.body);
    return { data, status: 200 };
}));
exports.default = router;
