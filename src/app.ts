import multipart from "@fastify/multipart";
import * as dotenv from "dotenv";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";
import { insertUserDevice } from "./db/mutations";
import { getAllUserDevices, getUserDevice } from "./db/queries";
import API from "./utils/api";
import { config } from "./utils/config";
import { admin } from "./utils/firebase";
import {
  AddUserDeviceBody,
  AppPushNotificationBody,
  FallPushNotificationBody,
  addUserDeviceSchema,
  appPushNotificationSchema,
  fallPushNotificationSchema,
} from "./utils/inputSchema";
import {
  NotificationCode,
  buildFallMessagePayload,
  buildMessagePayload,
} from "./utils/message";
import Cloudinary from "./utils/cloudinary";

dotenv.config();

const app = fastify();

app.register(multipart, { attachFieldsToBody: "keyValues" });

app.get("/", async () => {
  return "Server is running OK v5!";
});

app.post(
  "/register-token",
  { schema: addUserDeviceSchema },
  async (
    request: FastifyRequest<{
      Body: AddUserDeviceBody;
    }>,
    reply: FastifyReply
  ) => {
    const { userId, token } = request.body;

    const existingUserDevice = await getUserDevice(userId, token);
    if (existingUserDevice)
      return reply.status(400).send({
        code: 400,
        message: "User with this device is existed!",
      });

    const newUserDevice = await insertUserDevice(request.body);
    if (existingUserDevice)
      return reply.status(500).send({
        code: 500,
        message: "Server errors!",
      });

    return reply.status(201).send({
      code: 201,
      message: "Token registered successfully!",
      data: newUserDevice,
    });
  }
);

app.get(
  "/user-devices/:userId",
  async (
    request: FastifyRequest<{
      Params: {
        userId: string;
      };
    }>,
    reply: FastifyReply
  ) => {
    const { userId } = request.params;

    return reply.send({
      code: 200,
      message: "User devices",
      data: await getAllUserDevices(userId),
    });
  }
);

app.post(
  "/app-notify",
  { schema: appPushNotificationSchema },
  async (
    request: FastifyRequest<{
      Body: AppPushNotificationBody;
    }>,
    reply: FastifyReply
  ) => {
    const messaging = admin.messaging();

    const { receiverIDs, eventCode, meta } = request.body;

    const payload: MessagingPayload = buildMessagePayload(
      eventCode as NotificationCode,
      meta
    );
    try {
      await Promise.all(
        receiverIDs.map(async (id) => {
          const userDevices = await getAllUserDevices(id);

          return Promise.all(
            userDevices.map(async (item) =>
              messaging.sendToDevice(item.deviceToken!, payload)
            )
          );
        })
      );
    } catch (error) {
      return reply.status(500).send({
        code: 500,
        message: "Server errors!",
      });
    }

    return reply.send({
      code: 200,
      message: "Push notification successfully!",
    });
  }
);

app.post(
  "/fall-notify",
  { schema: fallPushNotificationSchema },
  async (
    request: FastifyRequest<{
      Body: FallPushNotificationBody;
    }>,
    reply: FastifyReply
  ) => {
    const messaging = admin.messaging();

    const { deviceSerial, image } = request.body;

    const data = await API.getDeviceBySerial(deviceSerial);
    if (!data) {
      return reply.status(400).send({
        code: 400,
        message: "Can't get device by this serial number!",
      });
    }

    const uploadedImage = await Cloudinary.uploadImage(image as Blob);
    if (!uploadedImage) {
      return reply.status(400).send({
        code: 400,
        message: "Can't upload image!",
      });
    }

    const {
      data: { device, room, members },
    } = data;

    const payload = await buildFallMessagePayload({
      deviceId: device.id,
      houseName: `${room.house}`,
      roomName: room.name,
      image: uploadedImage.secure_url,
    });
    if (!payload) {
      return reply.status(500).send({
        code: 500,
        message: "Can't build message payload!",
      });
    }

    const receiverIDs = members.map((member: { id: string }) => member.id);
    try {
      await Promise.all(
        receiverIDs.map(async (id: string) => {
          const userDevices = await getAllUserDevices(id);

          return Promise.all(
            userDevices.map(async (item) =>
              messaging.sendToDevice(item.deviceToken!, payload)
            )
          );
        })
      );
    } catch (error) {
      return reply.status(500).send({
        code: 500,
        message: "Server errors!",
      });
    }

    return reply.send({
      code: 200,
      message: "Push notification successfully!",
    });
  }
);

const start = async () => {
  try {
    await app.listen({
      port: config.PORT,
      host: "0.0.0.0",
    });
    console.log("Server listening on port: ", config.PORT);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
