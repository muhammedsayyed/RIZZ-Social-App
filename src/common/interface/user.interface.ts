import { GenderEnum, ProfileVisibilityEnum, ProviderEnum, RoleEnum, TwoStepVerificationEnum } from "../enum";
import mongoose from "mongoose";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    password?: string;
    provider: ProviderEnum;
    phone?: string;
    DOB?: string;
    confirmEmail?: Date;
    image?: string;
    coverImage?: string[];
    changeCredentialsTime?: Date;
    twoStepVerification: TwoStepVerificationEnum;
    gender: GenderEnum;
    role: RoleEnum;
    profileVisibility: ProfileVisibilityEnum;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    createdAt?:string;
    updatedAt?:string;
}
