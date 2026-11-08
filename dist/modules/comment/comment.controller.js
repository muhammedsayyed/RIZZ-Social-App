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
const comment_service_1 = __importDefault(require("./comment.service"));
const authentication_middleware_1 = __importDefault(require("../../middleware/authentication.middleware"));
const middleware_1 = require("../../middleware");
const validators = __importStar(require("./comment.validation"));
const router = (0, express_1.Router)({ strict: true, caseSensitive: true });
router.post("/:postId", authentication_middleware_1.default.authentication(), (0, middleware_1.validation)(validators.createComment), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await comment_service_1.default.createComment(req.user, req.validate.params.postId, req.validate.body);
    return { data, status: 201 };
}));
router.get("/post/:postId", authentication_middleware_1.default.authentication(), (0, middleware_1.validation)(validators.getPostComments), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await comment_service_1.default.getPostComments(req.validate.params.postId);
    return { data, status: 200 };
}));
router.get("/:commentId", authentication_middleware_1.default.authentication(), (0, middleware_1.validation)(validators.getSingleComment), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await comment_service_1.default.getSingleComment(req.validate.params.commentId);
    return { data, status: 200 };
}));
router.patch("/:commentId", authentication_middleware_1.default.authentication(), (0, middleware_1.validation)(validators.updateComment), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await comment_service_1.default.updateComment(req.user, req.validate.params.commentId, req.validate.body);
    return { data, status: 200 };
}));
router.delete("/:commentId", authentication_middleware_1.default.authentication(), (0, middleware_1.validation)(validators.deleteComment), (0, middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await comment_service_1.default.deleteComment(req.user, req.validate.params.commentId);
    return { data, status: 200 };
}));
exports.default = router;
