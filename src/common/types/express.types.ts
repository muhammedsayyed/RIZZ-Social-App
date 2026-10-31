// Extend Express Request interface with custom properties
declare module "express-serve-static-core" {
    interface Request {
        validate: any;
        payload: any;
        user: any;
    }
}
