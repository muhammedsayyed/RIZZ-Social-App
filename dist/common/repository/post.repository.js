"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const db_repository_1 = require("./db.repository");
const model_1 = require("../../DB/model");
class PostRepository extends db_repository_1.DatabaseRepository {
    constructor() {
        super(model_1.PostModel);
    }
}
exports.PostRepository = PostRepository;
