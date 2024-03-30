import { Static, Type } from '@sinclair/typebox';

export const addUserDeviceSchema = {
    tags: ['user_devices'],
    description: "Add user device",
    body: Type.Object({
        userId: Type.String({minLength: 1}),
        token: Type.String({minLength: 1}),
    })
}

export const appPushNotificationSchema = {
    tags: ['push_notification'],
    description: "Push notification",
    body: Type.Object({
        eventCode: Type.String({minLength: 1}),
        receiverIDs: Type.Array(Type.String()),
        meta: Type.Object({
            username: Type.String({minLength: 1}),
            avatar: Type.String({minLength: 1}),
            desName: Type.String({minLength: 1}),
            desImage: Type.String({minLength: 1}),
        })
    })
}

export type AddUserDeviceBody = Static<typeof addUserDeviceSchema.body>
export type AppPushNotificationBody = Static<typeof appPushNotificationSchema.body>
