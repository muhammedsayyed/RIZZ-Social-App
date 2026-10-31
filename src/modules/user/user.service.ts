import { UserRepository } from "../../common/repository";
import { CacheService, cacheService } from "../../common/service";
import { LogoutEnum, TokenTypeEnum } from "../../common/enum";
import { ConflictException, NotfoundException, BadRequestException } from "../../common/exception";
import tokenServiceInstance from "../../common/security/token.security";
import { IUser } from "../../common/interface";
import mongoose, { HydratedDocument } from "mongoose";
import { ACCESS_TOKEN_EXPIRES_IN } from "../../config";

export class UserService {
    private userRepository: UserRepository;
    private cacheService: CacheService;
    constructor() {
        this.cacheService = cacheService;
        this.userRepository = new UserRepository();
    }

    async rotateToken(payload: any, user: HydratedDocument<IUser>, issuer: string) {
        const accessExpiresIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN) * 1000;
        const currentTime = Date.now() + (30 * 60000);
        if (currentTime < accessExpiresIn) {
            throw new ConflictException("Sorry we cannot create new login credentials while current access token still within valid time range");
        }
        const data = await tokenServiceInstance.createLoginCredentials({ user, issuer });
        await tokenServiceInstance.createRevokeToken({ payload, user });
        return data;
    }

    async logout(payload: any, user: HydratedDocument<IUser>,
        { action = LogoutEnum.DEVICE }: { action?: LogoutEnum } = {}
    ): Promise<void> {
        switch (action) {
            case LogoutEnum.ALL:
                user.changeCredentialsTime = new Date();
                await user.save();
                await this.cacheService.del({
                    key: await this.cacheService.keys({prefix: tokenServiceInstance.userBaseRevokeTokenKey({userId: payload.sub})})
                });
                break;
            default:
                await tokenServiceInstance.createRevokeToken({ payload, user });
                break;
        }
        return;
    }


    // ===== Profile Retrieval & Update =====

    // Get the profile of the logged in user
    async getProfile(user: HydratedDocument<IUser>) {
        const profile = await this.userRepository.findById({
            id: user._id,
            projection: { password: 0, changeCredentialsTime: 0, __v: 0 },
            options: { lean: false }
        });
        if (!profile) throw new NotfoundException("User not found");
        return profile;
    }

    // Update the profile of the logged in user
    async updateProfile(user: HydratedDocument<IUser>, data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        DOB?: string;
        gender?: number;
    }) {
        const updated = await this.userRepository.findByIdAndUpdate({
            id: user._id,
            update: { $set: data },
            options: { projection: { password: 0, changeCredentialsTime: 0, __v: 0 } }
        });
        if (!updated) throw new NotfoundException("User not found");
        return updated;
    }


    // ===== Follow / Unfollow =====

    // Follow another user
    async followUser(currentUser: HydratedDocument<IUser>, targetUserId: string) {
        // Prevent user from following themselves
        if (currentUser._id.toString() === targetUserId) {
            throw new BadRequestException("You cannot follow yourself");
        }

        // Check if target user exists in database
        const targetUser = await this.userRepository.findById({
            id: new mongoose.Types.ObjectId(targetUserId),
            options: { lean: false }
        });
        if (!targetUser) throw new NotfoundException("User not found");

        // Check if the user is already following this account
        const alreadyFollowing = currentUser.following?.some(
            (id: mongoose.Types.ObjectId) => id.toString() === targetUserId
        );
        if (alreadyFollowing) {
            throw new ConflictException("You are already following this user");
        }

        // Add to following list of current user
        await this.userRepository.findByIdAndUpdate({
            id: currentUser._id,
            update: { $addToSet: { following: new mongoose.Types.ObjectId(targetUserId) } }
        });

        // Add to followers list of target user
        await this.userRepository.findByIdAndUpdate({
            id: new mongoose.Types.ObjectId(targetUserId),
            update: { $addToSet: { followers: currentUser._id } }
        });

        return { message: "User followed successfully" };
    }

    // Unfollow a user
    async unfollowUser(currentUser: HydratedDocument<IUser>, targetUserId: string) {
        // Prevent user from unfollowing themselves
        if (currentUser._id.toString() === targetUserId) {
            throw new BadRequestException("You cannot unfollow yourself");
        }

        // Check if target user exists
        const targetUser = await this.userRepository.findById({
            id: new mongoose.Types.ObjectId(targetUserId),
            options: { lean: false }
        });
        if (!targetUser) throw new NotfoundException("User not found");

        // Check if user is actually following this account
        const isFollowing = currentUser.following?.some(
            (id: mongoose.Types.ObjectId) => id.toString() === targetUserId
        );
        if (!isFollowing) {
            throw new ConflictException("You are not following this user");
        }

        // Remove from following list
        await this.userRepository.findByIdAndUpdate({
            id: currentUser._id,
            update: { $pull: { following: new mongoose.Types.ObjectId(targetUserId) } }
        });

        // Remove from followers list
        await this.userRepository.findByIdAndUpdate({
            id: new mongoose.Types.ObjectId(targetUserId),
            update: { $pull: { followers: currentUser._id } }
        });

        return { message: "User unfollowed successfully" };
    }


    // ===== Search & Suggestions =====

    // Search users by firstName, lastName, or full username
    async searchUsers(query: string, currentUserId: mongoose.Types.ObjectId, page: number = 1, limit: number = 10) {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const searchRegex = new RegExp(escapedQuery, "i");
        const filter = {
            _id: { $ne: currentUserId }, // Exclude the current user
            $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $concat: ["$firstName", " ", "$lastName"] },
                            regex: escapedQuery,
                            options: "i"
                        }
                    }
                },
            ]
        };
        const result = await this.userRepository.paginate({
            filter,
            page,
            limit,
            options: {
                select: "firstName lastName email image gender profileVisibility",
            }
        });
        return result;
    }

    // Suggest users to follow (excludes self and users already followed)
    async getSuggestions(currentUser: HydratedDocument<IUser>, page: number = 1, limit: number = 10) {
        const followingIds = currentUser.following || [];
        const excludeIds = [currentUser._id, ...followingIds];
        const filter = {
            _id: { $nin: excludeIds },
        };
        const result = await this.userRepository.paginate({
            filter,
            page,
            limit,
            options: {
                select: "firstName lastName email image gender profileVisibility",
            }
        });
        return result;
    }


    // ===== Account Settings & Privacy =====

    // Get account settings for the logged in user
    async getSettings(user: HydratedDocument<IUser>) {
        const account = await this.userRepository.findById({
            id: user._id,
            projection: { email: 1, firstName: 1, lastName: 1, gender: 1, phone: 1, DOB: 1, twoStepVerification: 1, profileVisibility: 1, provider: 1 },
            options: { lean: false }
        });
        if (!account) throw new NotfoundException("User not found");
        return account;
    }

    // Update account settings (like switching between public and private profile)
    async updateSettings(user: HydratedDocument<IUser>, data: {
        profileVisibility?: number;
    }) {
        const updated = await this.userRepository.findByIdAndUpdate({
            id: user._id,
            update: { $set: data },
            options: { projection: { email: 1, firstName: 1, lastName: 1, gender: 1, phone: 1, DOB: 1, twoStepVerification: 1, profileVisibility: 1, provider: 1 } }
        });
        if (!updated) throw new NotfoundException("User not found");
        return updated;
    }
}

export default new UserService();
