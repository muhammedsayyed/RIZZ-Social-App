"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repository_1 = require("../../common/repository");
const exception_1 = require("../../common/exception");
class PostService {
    postRepository;
    constructor() {
        this.postRepository = new repository_1.PostRepository();
    }
    async createPost(user, data) {
        const post = await this.postRepository.createOne({
            data: {
                content: data.content,
                userId: user._id,
            },
        });
        return post;
    }
    async getAllPosts(user) {
        const posts = await this.postRepository.find({
            filter: { userId: user._id },
        });
        return posts;
    }
    async getSinglePost(postId) {
        const post = await this.postRepository.findById({
            id: new mongoose_1.default.Types.ObjectId(postId),
            options: { lean: false },
        });
        if (!post)
            throw new exception_1.NotfoundException("Post not found");
        return post;
    }
    async updatePost(user, postId, data) {
        const post = await this.postRepository.findById({
            id: new mongoose_1.default.Types.ObjectId(postId),
            options: { lean: false },
        });
        if (!post)
            throw new exception_1.NotfoundException("Post not found");
        if (post.userId.toString() !== user._id.toString()) {
            throw new exception_1.ForbiddenException("Only the post owner can update this post");
        }
        const updated = await this.postRepository.findByIdAndUpdate({
            id: post._id,
            update: { $set: { content: data.content } },
        });
        return updated;
    }
    async deletePost(user, postId) {
        const post = await this.postRepository.findById({
            id: new mongoose_1.default.Types.ObjectId(postId),
            options: { lean: false },
        });
        if (!post)
            throw new exception_1.NotfoundException("Post not found");
        if (post.userId.toString() !== user._id.toString()) {
            throw new exception_1.ForbiddenException("Only the post owner can delete this post");
        }
        await this.postRepository.findByIdAndDelete({ id: post._id });
        return { message: "Post deleted successfully" };
    }
}
exports.PostService = PostService;
exports.default = new PostService();
