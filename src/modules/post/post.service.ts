import mongoose, { HydratedDocument } from "mongoose";
import { PostRepository } from "../../common/repository";
import { ForbiddenException, NotfoundException } from "../../common/exception";
import { IUser } from "../../common/interface";

export class PostService {
    private postRepository: PostRepository;

    constructor() {
        this.postRepository = new PostRepository();
    }

    async createPost(user: HydratedDocument<IUser>, data: { content: string }) {
        const post = await this.postRepository.createOne({
            data: {
                content: data.content,
                userId: user._id,
            },
        });
        return post;
    }

    async getAllPosts(user: HydratedDocument<IUser>) {
        const posts = await this.postRepository.find({
            filter: { userId: user._id },
        });
        return posts;
    }

    async getSinglePost(postId: string) {
        const post = await this.postRepository.findById({
            id: new mongoose.Types.ObjectId(postId),
            options: { lean: false },
        });
        if (!post) throw new NotfoundException("Post not found");
        return post;
    }

    async updatePost(user: HydratedDocument<IUser>, postId: string, data: { content: string }) {
        const post = await this.postRepository.findById({
            id: new mongoose.Types.ObjectId(postId),
            options: { lean: false },
        });
        if (!post) throw new NotfoundException("Post not found");

        // Only the post owner can update
        if (post.userId.toString() !== user._id.toString()) {
            throw new ForbiddenException("Only the post owner can update this post");
        }

        const updated = await this.postRepository.findByIdAndUpdate({
            id: post._id,
            update: { $set: { content: data.content } },
        });
        return updated;
    }

    async deletePost(user: HydratedDocument<IUser>, postId: string) {
        const post = await this.postRepository.findById({
            id: new mongoose.Types.ObjectId(postId),
            options: { lean: false },
        });
        if (!post) throw new NotfoundException("Post not found");

        // Only the post owner can delete
        if (post.userId.toString() !== user._id.toString()) {
            throw new ForbiddenException("Only the post owner can delete this post");
        }

        await this.postRepository.findByIdAndDelete({ id: post._id });
        return { message: "Post deleted successfully" };
    }
}

export default new PostService();
