import mongoose from "mongoose";
import { NotificationTypeEnum } from "../enum";

export interface INotification {
    _id?: mongoose.Types.ObjectId;
    recipientId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    type: NotificationTypeEnum;
    targetId: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt?: Date;
}
