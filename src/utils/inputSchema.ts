import { Static, Type } from '@sinclair/typebox';

export const addUserDeviceSchema = {
    tags: ['user_devices'],
    description: "Add user device",
    body: Type.Object({
        userId: Type.String({minLength: 1}),
        deviceToken: Type.String({minLength: 1}),
    })
}

export const pushNotificationSchema = {
    tags: ['push_notification'],
    description: "Push notification",
    body: Type.Object({
        // sender: Type.Object({
        //     id: Type.String({minLength: 1}),
        //     username: Type.String({minLength: 1}),
        //     imageUrl: Type.String({minLength: 1}),
        // }),
        receiverId: Type.String({minLength: 1}),
        title: Type.String(),
        description: Type.String(),
    })
}

export type AddUserDeviceBody = Static<typeof addUserDeviceSchema.body>
export type PushNotificationBody = Static<typeof pushNotificationSchema.body>
