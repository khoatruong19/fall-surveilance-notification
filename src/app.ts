import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { admin } from "./utils/firebase";
import * as dotenv from "dotenv";
import { config } from './utils/config';
import { getAllUserDevices, getUserDevice } from "./db/queries";
import { AddUserDeviceBody, AppPushNotificationBody, addUserDeviceSchema, appPushNotificationSchema } from "./utils/inputSchema";
import { insertUserDevice } from "./db/mutations";
import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";
import { NotificationCode, buildMessagePayload } from "./utils/message";

dotenv.config();

const app = fastify();

app.get("/", async () => {
  return "Server is running OK v3!";
});

app.post('/register-token', {schema: addUserDeviceSchema}, async (request: FastifyRequest<{
  Body: AddUserDeviceBody
}>, reply: FastifyReply) => {
  const { userId, token} = request.body
  console.log({userId, token})
  const existingUserDevice = await getUserDevice(userId, token)
  if(existingUserDevice) return reply.status(400).send({
    code: 400,
    message: "User with this device is existed!"
  })

  const newUserDevice =  await insertUserDevice(request.body)
  if(existingUserDevice) return reply.status(500).send({
    code: 500,
    message: "Server errors!"
  })

  return reply.status(201).send({
    code: 201,
    message: "Token registered successfully!",
    data: newUserDevice
  })
})

app.get('/user-devices/:userId', async (request: FastifyRequest<{
  Params: {
    userId: string
  }
}>, reply: FastifyReply) => {
  const { userId } = request.params
 
  return reply.send({
    code: 200,
    message: "User devices",
    data: await getAllUserDevices(userId)
  })
})

app.post("/app-notify", {schema: appPushNotificationSchema},async (request: FastifyRequest<{
 Body: AppPushNotificationBody
}>, reply: FastifyReply) => {
  const messaging = admin.messaging();

  const { receiverIDs, eventCode, meta } = request.body

  const payload: MessagingPayload = buildMessagePayload(eventCode as NotificationCode, meta)
  try {
    await Promise.all(receiverIDs.map(async id => {
      const userDevices = await getAllUserDevices(id);

      return Promise.all(userDevices.map(async item => messaging.sendToDevice(item.deviceToken!, payload)));
  }));
  } catch (error) {
    return reply.status(500).send({
      code: 500,
      message: "Server errors!",
    })
  }

  return reply.send({
    code: 200,
    message: "Push notification successfully!",
  })
});

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
