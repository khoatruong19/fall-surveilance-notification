import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api"
import { AppPushNotificationBody } from "./inputSchema";

const NOTIFICATION_MESSAGE = {
    INVITED_TO_HOUSE: {
        title: "House Invite",
        body: " added you to his house ",
    },
    INVITED_TO_ROOM: {
        title: "Room Invite",
        body: " added you to his room ",
    },
    REMOVED_FROM_ROOM: {
        title: "Room Remove",
        body: " removed you from his room ",
    },
    REMOVED_FROM_HOUSE: {
        title: "House Remove",
        body: " removed you from his house ",
    },
}

export type NotificationCode =  keyof typeof NOTIFICATION_MESSAGE

export const buildMessagePayload = (eventCode: NotificationCode, meta: AppPushNotificationBody['meta']) : MessagingPayload => {
    const messagePayload: MessagingPayload = {
        notification: {
          title: NOTIFICATION_MESSAGE[eventCode].title,
          body: meta.username + NOTIFICATION_MESSAGE[eventCode].body + meta.desName,
        },
        data: {
          image: meta.desImage,
        },
      };

    return messagePayload
}