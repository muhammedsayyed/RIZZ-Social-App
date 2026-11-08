import { NextFunction, Response, Router } from "express";
import postService from "./post.service";
import { IAuthRequest, IResponse } from "../../common/interface";
import authenticationMiddleware from "../../middleware/authentication.middleware";
import { responseFormatter, validation } from "../../middleware";
import * as validators from "./post.validation";

const router = Router({ strict: true, caseSensitive: true });

// 1. Create Post
router.post("/",
    authenticationMiddleware.authentication(),
    validation(validators.createPost),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await postService.createPost(req.user, req.validate.body);
            return { data, status: 201 };
        }
    )
);

// 2. Get All Posts (created by logged-in user)
router.get("/",
    authenticationMiddleware.authentication(),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await postService.getAllPosts(req.user);
            return { data, status: 200 };
        }
    )
);

// 3. Get Single Post
router.get("/:postId",
    authenticationMiddleware.authentication(),
    validation(validators.getSinglePost),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await postService.getSinglePost(req.validate.params.postId);
            return { data, status: 200 };
        }
    )
);

// 4. Update Post (owner only)
router.patch("/:postId",
    authenticationMiddleware.authentication(),
    validation(validators.updatePost),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await postService.updatePost(req.user, req.validate.params.postId, req.validate.body);
            return { data, status: 200 };
        }
    )
);

// 5. Delete Post (owner only)
router.delete("/:postId",
    authenticationMiddleware.authentication(),
    validation(validators.deletePost),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await postService.deletePost(req.user, req.validate.params.postId);
            return { data, status: 200 };
        }
    )
);

export default router;

