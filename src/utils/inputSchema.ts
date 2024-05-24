import { Static, Type } from "@sinclair/typebox";

export const addUserDeviceSchema = {
  tags: ["user_devices"],
  description: "Add user device",
  body: Type.Object({
    userId: Type.String({ minLength: 1 }),
    token: Type.String({ minLength: 1 }),
  }),
};

export const appPushNotificationSchema = {
  tags: ["push_notification"],
  description: "Push notification",
  body: Type.Object({
    eventCode: Type.String({ minLength: 1 }),
    receiverIDs: Type.Array(Type.String()),
    meta: Type.Object({
      username: Type.String({ minLength: 1 }),
      avatar: Type.String({ minLength: 1 }),
      desName: Type.String({ minLength: 1 }),
      desImage: Type.String({ minLength: 1 }),
    }),
  }),
};

export const fallPushNotificationSchema = {
  tags: ["fall_push_notification"],
  description: "Fall push notification",
  body: Type.Object({
    image: Type.Any(),
    deviceSerial: Type.String({ minLength: 1 }),
  }),
};

export const addJetsonDeviceSchema = {
  tags: ["add_jetson_device"],
  description: "Add jetson device",
  body: Type.Object({
    deviceSerial: Type.String({ minLength: 1 }),
    deviceId: Type.String({ minLength: 1 }),
  }),
};

export const deleteJetsonDeviceSchema = {
  tags: ["delete_jetson_device"],
  description: "Delete jetson device",
  params: {
    id: Type.String(),
  },
};

export type AddUserDeviceBody = Static<typeof addUserDeviceSchema.body>;
export type AppPushNotificationBody = Static<
  typeof appPushNotificationSchema.body
>;
export type FallPushNotificationBody = Static<
  typeof fallPushNotificationSchema.body
>;
export type AddJetsonDeviceBody = Static<typeof addJetsonDeviceSchema.body>;
