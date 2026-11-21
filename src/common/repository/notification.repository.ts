import { INotification } from "../interface";
import { DatabaseRepository } from "./db.repository";
import { NotificationModel } from "../../DB/model";

export class NotificationRepository extends DatabaseRepository<INotification> {
    constructor() {
        super(NotificationModel);
    }
}
