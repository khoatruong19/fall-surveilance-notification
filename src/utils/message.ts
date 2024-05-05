import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";
import {
  AppPushNotificationBody,
  FallPushNotificationBody,
} from "./inputSchema";
import { getDeviceId } from "../db/queries";

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
  deviceSerial,
  ...rest
}: FallPushNotificationBody["meta"]): Promise<MessagingPayload | null> => {
  const deviceId = await getDeviceId(deviceSerial);
  if (!deviceId) return null;

  const fallMessage = buildFallMessage(rest);
  const messagePayload: MessagingPayload = {
    notification: {
      title: fallMessage.title,
      body: fallMessage.body,
      icon: deviceId,
    },
    data: {
      image:
        "https://media.istockphoto.com/id/1200411318/vector/isolated-slippery-surface-common-hazards-symbols-on-yellow-round-triangle-board-warning-sign.jpg?s=612x612&w=0&k=20&c=glWpQrWDGSm_1OfWAXBMSntY5WTwHXz1loBQG4jgiH8=",
    },
  };

  return messagePayload;
};
