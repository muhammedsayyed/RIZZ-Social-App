"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const db_repository_1 = require("./db.repository");
const model_1 = require("../../DB/model");
class NotificationRepository extends db_repository_1.DatabaseRepository {
    constructor() {
        super(model_1.NotificationModel);
    }
}
exports.NotificationRepository = NotificationRepository;
