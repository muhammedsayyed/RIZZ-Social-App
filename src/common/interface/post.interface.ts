import mongoose from "mongoose";

export interface IPost {
    _id?: mongoose.Types.ObjectId;
    content: string;
    userId: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
