import { NextFunction, Response, Router } from "express";
import commentService from "./comment.service";
import { IAuthRequest, IResponse } from "../../common/interface";
import authenticationMiddleware from "../../middleware/authentication.middleware";
import { responseFormatter, validation } from "../../middleware";
import * as validators from "./comment.validation";

const router = Router({ strict: true, caseSensitive: true });

// 1. Create Comment on a Post
router.post("/:postId",
    authenticationMiddleware.authentication(),
    validation(validators.createComment),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await commentService.createComment(req.user, req.validate.params.postId, req.validate.body);
            return { data, status: 201 };
        }
    )
);

// 2. Get All Comments for a Post
router.get("/post/:postId",
    authenticationMiddleware.authentication(),
    validation(validators.getPostComments),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await commentService.getPostComments(req.validate.params.postId);
            return { data, status: 200 };
        }
    )
);

// 3. Get Single Comment by ID
router.get("/:commentId",
    authenticationMiddleware.authentication(),
    validation(validators.getSingleComment),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await commentService.getSingleComment(req.validate.params.commentId);
            return { data, status: 200 };
        }
    )
);

// 4. Update Comment (owner only)
router.patch("/:commentId",
    authenticationMiddleware.authentication(),
    validation(validators.updateComment),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await commentService.updateComment(req.user, req.validate.params.commentId, req.validate.body);
            return { data, status: 200 };
        }
    )
);

// 5. Delete Comment (comment owner or post owner)
router.delete("/:commentId",
    authenticationMiddleware.authentication(),
    validation(validators.deleteComment),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await commentService.deleteComment(req.user, req.validate.params.commentId);
            return { data, status: 200 };
        }
    )
);

export default router;

