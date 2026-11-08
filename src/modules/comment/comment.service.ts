import mongoose, { HydratedDocument } from "mongoose";
import { CommentRepository, PostRepository } from "../../common/repository";
import { ForbiddenException, NotfoundException } from "../../common/exception";
import { IUser } from "../../common/interface";

export class CommentService {
    private commentRepository: CommentRepository;
    private postRepository: PostRepository;

    constructor() {
        this.commentRepository = new CommentRepository();
        this.postRepository = new PostRepository();
    }

    async createComment(user: HydratedDocument<IUser>, postId: string, data: { content: string }) {
        const post = await this.postRepository.findById({
            id: new mongoose.Types.ObjectId(postId),
            options: { lean: false },
        });
        if (!post) throw new NotfoundException("Post not found");

        const comment = await this.commentRepository.createOne({
            data: {
                content: data.content,
                postId: post._id,
                userId: user._id,
            },
        });
        return comment;
    }

    async getPostComments(postId: string) {
        const post = await this.postRepository.findById({
            id: new mongoose.Types.ObjectId(postId),
            options: { lean: false },
        });
        if (!post) throw new NotfoundException("Post not found");

        const comments = await this.commentRepository.find({
            filter: { postId: post._id },
        });
        return comments;
    }

    async getSingleComment(commentId: string) {
        const comment = await this.commentRepository.findById({
            id: new mongoose.Types.ObjectId(commentId),
            options: { lean: false },
        });
        if (!comment) throw new NotfoundException("Comment not found");
        return comment;
    }

    async updateComment(user: HydratedDocument<IUser>, commentId: string, data: { content: string }) {
        const comment = await this.commentRepository.findById({
            id: new mongoose.Types.ObjectId(commentId),
            options: { lean: false },
        });
        if (!comment) throw new NotfoundException("Comment not found");

        // Only the comment owner can update
        if (comment.userId.toString() !== user._id.toString()) {
            throw new ForbiddenException("Only the comment owner can update this comment");
        }

        const updated = await this.commentRepository.findByIdAndUpdate({
            id: comment._id,
            update: { $set: { content: data.content } },
        });
        return updated;
    }

    async deleteComment(user: HydratedDocument<IUser>, commentId: string) {
        const comment = await this.commentRepository.findById({
            id: new mongoose.Types.ObjectId(commentId),
            options: { lean: false },
        });
        if (!comment) throw new NotfoundException("Comment not found");

        const isCommentOwner = comment.userId.toString() === user._id.toString();

        // If not comment owner, check if user is the post owner
        if (!isCommentOwner) {
            const post = await this.postRepository.findById({
                id: comment.postId,
                options: { lean: false },
            });
            const isPostOwner = post ? post.userId.toString() === user._id.toString() : false;
            if (!isPostOwner) {
                throw new ForbiddenException("Only the comment owner or post owner can delete this comment");
            }
        }

        await this.commentRepository.findByIdAndDelete({ id: comment._id });
        return { message: "Comment deleted successfully" };
    }
}

export default new CommentService();
