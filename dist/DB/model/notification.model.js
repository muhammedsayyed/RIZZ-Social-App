"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../../common/enum");
const notificationSchema = new mongoose_1.default.Schema({
    recipientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: Number,
        enum: enum_1.NotificationTypeEnum,
        required: true,
    },
    targetId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
});
exports.NotificationModel = mongoose_1.default.models.Notification ||
    mongoose_1.default.model("Notification", notificationSchema);
