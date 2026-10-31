import { NextFunction, Response, Router } from "express";
import userService from "./user.service";
import { IAuthRequest, IResponse } from "../../common/interface";
import authenticationMiddleware from "../../middleware/authentication.middleware";
import { TokenTypeEnum } from "../../common/enum";
import { responseFormatter, validation } from "../../middleware";
import * as validators from "./user.validation";

const router = Router({ strict: true, caseSensitive: true });

// ===== Token & Session =====

router.post("/rotate-token",
    authenticationMiddleware.authentication(TokenTypeEnum.ACCESS),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await userService.rotateToken(
                req.payload,
                req.user,
                `${req.protocol}://${req.host}`
            );
            return { data, status: 200 };
        }
    )
);

router.post("/logout",
    authenticationMiddleware.authentication(),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            await userService.logout(req.payload, req.user, req.body);
            return { data: { message: "Logged out successfully" }, status: 200 };
        }
    )
);


// ===== Profile Retrieval & Update =====

router.get("/profile",
    authenticationMiddleware.authentication(),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await userService.getProfile(req.user);
            return { data, status: 200 };
        }
    )
);

router.patch("/profile",
    authenticationMiddleware.authentication(),
    validation(validators.updateProfile),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await userService.updateProfile(req.user, req.validate.body);
            return { data, status: 200 };
        }
    )
);


// ===== Follow / Unfollow =====

router.post("/follow/:userId",
    authenticationMiddleware.authentication(),
    validation(validators.followUser),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await userService.followUser(req.user, req.validate.params.userId);
            return { data, status: 200 };
        }
    )
);

router.delete("/unfollow/:userId",
    authenticationMiddleware.authentication(),
    validation(validators.unfollowUser),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await userService.unfollowUser(req.user, req.validate.params.userId);
            return { data, status: 200 };
        }
    )
);


// ===== Search & Suggestions =====

router.get("/search",
    authenticationMiddleware.authentication(),
    validation(validators.searchUsers),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const { q, page, limit } = req.validate.query;
            const data = await userService.searchUsers(q, req.user._id, page, limit);
            return { data, status: 200 };
        }
    )
);

router.get("/suggestions",
    authenticationMiddleware.authentication(),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const data = await userService.getSuggestions(req.user, page, limit);
            return { data, status: 200 };
        }
    )
);


// ===== Account Settings & Privacy =====

router.get("/settings",
    authenticationMiddleware.authentication(),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await userService.getSettings(req.user);
            return { data, status: 200 };
        }
    )
);

router.patch("/settings",
    authenticationMiddleware.authentication(),
    validation(validators.updateSettings),
    responseFormatter(
        async (req: IAuthRequest, res: Response, next: NextFunction): Promise<IResponse> => {
            const data = await userService.updateSettings(req.user, req.validate.body);
            return { data, status: 200 };
        }
    )
);

export default router;
