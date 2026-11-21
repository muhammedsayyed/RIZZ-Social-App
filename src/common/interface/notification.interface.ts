import mongoose from "mongoose";

export interface INotification {
    _id?: mongoose.Types.ObjectId;
    notification_id?: mongoose.Types.ObjectId;
    recipient_id: mongoose.Types.ObjectId;
    sender_id: mongoose.Types.ObjectId;
    type: string;
    target_id?: mongoose.Types.ObjectId;
    is_read: boolean;
    created_at?: Date;
}
