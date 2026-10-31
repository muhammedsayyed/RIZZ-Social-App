"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const repository_1 = require("../../common/repository");
const service_1 = require("../../common/service");
const enum_1 = require("../../common/enum");
const exception_1 = require("../../common/exception");
const token_security_1 = __importDefault(require("../../common/security/token.security"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../../config");
class UserService {
    userRepository;
    cacheService;
    constructor() {
        this.cacheService = service_1.cacheService;
        this.userRepository = new repository_1.UserRepository();
    }
    async rotateToken(payload, user, issuer) {
        const accessExpiresIn = (payload.iat + config_1.ACCESS_TOKEN_EXPIRES_IN) * 1000;
        const currentTime = Date.now() + (30 * 60000);
        if (currentTime < accessExpiresIn) {
            throw new exception_1.ConflictException("Sorry we cannot create new login credentials while current access token still within valid time range");
        }
        const data = await token_security_1.default.createLoginCredentials({ user, issuer });
        await token_security_1.default.createRevokeToken({ payload, user });
        return data;
    }
    async logout(payload, user, { action = enum_1.LogoutEnum.DEVICE } = {}) {
        switch (action) {
            case enum_1.LogoutEnum.ALL:
                user.changeCredentialsTime = new Date();
                await user.save();
                await this.cacheService.del({
                    key: await this.cacheService.keys({ prefix: token_security_1.default.userBaseRevokeTokenKey({ userId: payload.sub }) })
                });
                break;
            default:
                await token_security_1.default.createRevokeToken({ payload, user });
                break;
        }
        return;
    }
    async getProfile(user) {
        const profile = await this.userRepository.findById({
            id: user._id,
            projection: { password: 0, changeCredentialsTime: 0, __v: 0 },
            options: { lean: false }
        });
        if (!profile)
            throw new exception_1.NotfoundException("User not found");
        return profile;
    }
    async updateProfile(user, data) {
        const updated = await this.userRepository.findByIdAndUpdate({
            id: user._id,
            update: { $set: data },
            options: { projection: { password: 0, changeCredentialsTime: 0, __v: 0 } }
        });
        if (!updated)
            throw new exception_1.NotfoundException("User not found");
        return updated;
    }
    async followUser(currentUser, targetUserId) {
        if (currentUser._id.toString() === targetUserId) {
            throw new exception_1.BadRequestException("You cannot follow yourself");
        }
        const targetUser = await this.userRepository.findById({
            id: new mongoose_1.default.Types.ObjectId(targetUserId),
            options: { lean: false }
        });
        if (!targetUser)
            throw new exception_1.NotfoundException("User not found");
        const alreadyFollowing = currentUser.following?.some((id) => id.toString() === targetUserId);
        if (alreadyFollowing) {
            throw new exception_1.ConflictException("You are already following this user");
        }
        await this.userRepository.findByIdAndUpdate({
            id: currentUser._id,
            update: { $addToSet: { following: new mongoose_1.default.Types.ObjectId(targetUserId) } }
        });
        await this.userRepository.findByIdAndUpdate({
            id: new mongoose_1.default.Types.ObjectId(targetUserId),
            update: { $addToSet: { followers: currentUser._id } }
        });
        return { message: "User followed successfully" };
    }
    async unfollowUser(currentUser, targetUserId) {
        if (currentUser._id.toString() === targetUserId) {
            throw new exception_1.BadRequestException("You cannot unfollow yourself");
        }
        const targetUser = await this.userRepository.findById({
            id: new mongoose_1.default.Types.ObjectId(targetUserId),
            options: { lean: false }
        });
        if (!targetUser)
            throw new exception_1.NotfoundException("User not found");
        const isFollowing = currentUser.following?.some((id) => id.toString() === targetUserId);
        if (!isFollowing) {
            throw new exception_1.ConflictException("You are not following this user");
        }
        await this.userRepository.findByIdAndUpdate({
            id: currentUser._id,
            update: { $pull: { following: new mongoose_1.default.Types.ObjectId(targetUserId) } }
        });
        await this.userRepository.findByIdAndUpdate({
            id: new mongoose_1.default.Types.ObjectId(targetUserId),
            update: { $pull: { followers: currentUser._id } }
        });
        return { message: "User unfollowed successfully" };
    }
    async searchUsers(query, currentUserId, page = 1, limit = 10) {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const searchRegex = new RegExp(escapedQuery, "i");
        const filter = {
            _id: { $ne: currentUserId },
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
    async getSuggestions(currentUser, page = 1, limit = 10) {
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
    async getSettings(user) {
        const account = await this.userRepository.findById({
            id: user._id,
            projection: { email: 1, firstName: 1, lastName: 1, gender: 1, phone: 1, DOB: 1, twoStepVerification: 1, profileVisibility: 1, provider: 1 },
            options: { lean: false }
        });
        if (!account)
            throw new exception_1.NotfoundException("User not found");
        return account;
    }
    async updateSettings(user, data) {
        const updated = await this.userRepository.findByIdAndUpdate({
            id: user._id,
            update: { $set: data },
            options: { projection: { email: 1, firstName: 1, lastName: 1, gender: 1, phone: 1, DOB: 1, twoStepVerification: 1, profileVisibility: 1, provider: 1 } }
        });
        if (!updated)
            throw new exception_1.NotfoundException("User not found");
        return updated;
    }
}
exports.UserService = UserService;
exports.default = new UserService();
