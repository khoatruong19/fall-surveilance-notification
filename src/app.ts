import fastify from "fastify";
import { admin } from "./firebase";

// Instantiate Fastify
const app = fastify();

// Define routes
app.get("/", async (request, reply) => {
  const messaging = admin.messaging();

  const payload = {
    notification: {
      title: "New Message From Server",
      body: "Lets goo!",
    },
  };
  const registrationToken =
    "d4CQJ4ehReW7EOur-rJeR2:APA91bEywngJJrGmOr8zBmb0VacHJkFPN9VjS13OUjhTrUY-F4XbSrrWcuGPr06AFwvrgr-r7o1kR-wvhUQn4JJOuj6AIiEsqj6iZTdag8JNt2-tut-J9bfwANDG66ns4Mx3IhD3IwkX";

  messaging
    .sendToDevice(registrationToken, payload)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });

  return { hello: "world 2" };
});

// Start the server
const start = async () => {
  try {
    await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });
    console.log("Server listening on http://localhost:3000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
