import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";
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
};

const buildFallMessage = ({
  houseName,
  roomName,
}: {
  houseName: string;
  roomName: string;
}) => ({
  title: "Fall Detected",
  body: `Fall detected at house '${houseName}' in room '${roomName}'`,
});

export type NotificationCode = keyof typeof NOTIFICATION_MESSAGE;

export const buildMessagePayload = (
  eventCode: NotificationCode,
  meta: AppPushNotificationBody["meta"]
): MessagingPayload => {
  const messagePayload: MessagingPayload = {
    notification: {
      title: NOTIFICATION_MESSAGE[eventCode].title,
      body: meta.username + NOTIFICATION_MESSAGE[eventCode].body + meta.desName,
    },
    data: {
      image: meta.desImage,
    },
  };

  return messagePayload;
};

export const buildFallMessagePayload = async ({
  deviceId,
  image,
  ...rest
}: {
  deviceId: string;
  houseName: string;
  roomName: string;
  image: string;
}): Promise<MessagingPayload | null> => {
  const fallMessage = buildFallMessage(rest);
  const messagePayload: MessagingPayload = {
    notification: {
      title: fallMessage.title,
      body: fallMessage.body,
      icon: deviceId,
    },
    data: {
      image,
    },
  };

  return messagePayload;
};
