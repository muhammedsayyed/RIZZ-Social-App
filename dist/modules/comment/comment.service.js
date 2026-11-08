"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repository_1 = require("../../common/repository");
const exception_1 = require("../../common/exception");
class CommentService {
    commentRepository;
    postRepository;
    constructor() {
        this.commentRepository = new repository_1.CommentRepository();
        this.postRepository = new repository_1.PostRepository();
    }
    async createComment(user, postId, data) {
        const post = await this.postRepository.findById({
            id: new mongoose_1.default.Types.ObjectId(postId),
            options: { lean: false },
        });
        if (!post)
            throw new exception_1.NotfoundException("Post not found");
        const comment = await this.commentRepository.createOne({
            data: {
                content: data.content,
                postId: post._id,
                userId: user._id,
            },
        });
        return comment;
    }
    async getPostComments(postId) {
        const post = await this.postRepository.findById({
            id: new mongoose_1.default.Types.ObjectId(postId),
            options: { lean: false },
        });
        if (!post)
            throw new exception_1.NotfoundException("Post not found");
        const comments = await this.commentRepository.find({
            filter: { postId: post._id },
        });
        return comments;
    }
    async getSingleComment(commentId) {
        const comment = await this.commentRepository.findById({
            id: new mongoose_1.default.Types.ObjectId(commentId),
            options: { lean: false },
        });
        if (!comment)
            throw new exception_1.NotfoundException("Comment not found");
        return comment;
    }
    async updateComment(user, commentId, data) {
        const comment = await this.commentRepository.findById({
            id: new mongoose_1.default.Types.ObjectId(commentId),
            options: { lean: false },
        });
        if (!comment)
            throw new exception_1.NotfoundException("Comment not found");
        if (comment.userId.toString() !== user._id.toString()) {
            throw new exception_1.ForbiddenException("Only the comment owner can update this comment");
        }
        const updated = await this.commentRepository.findByIdAndUpdate({
            id: comment._id,
            update: { $set: { content: data.content } },
        });
        return updated;
    }
    async deleteComment(user, commentId) {
        const comment = await this.commentRepository.findById({
            id: new mongoose_1.default.Types.ObjectId(commentId),
            options: { lean: false },
        });
        if (!comment)
            throw new exception_1.NotfoundException("Comment not found");
        const isCommentOwner = comment.userId.toString() === user._id.toString();
        if (!isCommentOwner) {
            const post = await this.postRepository.findById({
                id: comment.postId,
                options: { lean: false },
            });
            const isPostOwner = post ? post.userId.toString() === user._id.toString() : false;
            if (!isPostOwner) {
                throw new exception_1.ForbiddenException("Only the comment owner or post owner can delete this comment");
            }
        }
        await this.commentRepository.findByIdAndDelete({ id: comment._id });
        return { message: "Comment deleted successfully" };
    }
}
exports.CommentService = CommentService;
exports.default = new CommentService();
