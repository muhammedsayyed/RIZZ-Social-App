import mongoose from "mongoose";
import { INotification } from "../../common/interface";
import { NotificationTypeEnum } from "../../common/enum";

const notificationSchema = new mongoose.Schema<INotification>(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: Number,
            enum: NotificationTypeEnum,
            required: true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        strict: true,
        strictQuery: true,
    }
);

export const NotificationModel =
    mongoose.models.Notification ||
    mongoose.model<INotification>("Notification", notificationSchema);
