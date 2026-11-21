"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTypeEnum = void 0;
var NotificationTypeEnum;
(function (NotificationTypeEnum) {
    NotificationTypeEnum[NotificationTypeEnum["FOLLOW"] = 0] = "FOLLOW";
    NotificationTypeEnum[NotificationTypeEnum["LIKE"] = 1] = "LIKE";
    NotificationTypeEnum[NotificationTypeEnum["COMMENT"] = 2] = "COMMENT";
    NotificationTypeEnum[NotificationTypeEnum["MENTION"] = 3] = "MENTION";
})(NotificationTypeEnum || (exports.NotificationTypeEnum = NotificationTypeEnum = {}));
