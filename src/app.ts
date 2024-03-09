import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { admin } from "./utils/firebase";
import * as dotenv from "dotenv";
import { config } from './utils/config';
import { getAllUserDevices, getUserDevice } from "./db/queries";
import { AddUserDeviceBody, PushNotificationBody, addUserDeviceSchema, pushNotificationSchema } from "./utils/inputSchema";
import { insertUserDevice } from "./db/mutations";

dotenv.config();

const app = fastify();

app.get("/", async () => {
  return "Server is running OK!";
});

app.post('/user-devices', {schema: addUserDeviceSchema}, async (request: FastifyRequest<{
  Body: AddUserDeviceBody
}>, reply: FastifyReply) => {
  const { userId, deviceToken} = request.body

  const existingUserDevice = await getUserDevice(userId, deviceToken)
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
    message: "User device added",
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

app.post("/push-notification", {schema: pushNotificationSchema},async (request: FastifyRequest<{
 Body: PushNotificationBody
}>, reply: FastifyReply) => {
  const messaging = admin.messaging();

  const { receiverId, title = "", description = "" } = request.body

  const userDevices = await getAllUserDevices(receiverId)
  if(!userDevices.length) return reply.status(400).send({
    code: 400,
    message: "Receiver has no devices",
  })

  const payload = {
    notification: {
      title,
      body: description,
    },
  };

  try {
    await Promise.all(userDevices.map(item => messaging.sendToDevice(item.deviceToken!, payload)))
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
