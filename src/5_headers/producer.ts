import amqp from "amqplib";
import { HEADERS_EXCHANGE } from "./constant.js";

interface Notification {
  message: object;
  headers: object;
}
async function sendNotification({ message, headers }: Notification) {
  try {
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    await channel.assertExchange(HEADERS_EXCHANGE, "headers", {
      durable: true,
    });

    await channel.publish(
      HEADERS_EXCHANGE,
      "",
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
        headers,
      }
    );

    setTimeout(async () => {
      await connection.close();
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}
sendNotification({
  message: {
    data: "Some subscribed your channel",
  },
  headers: {
    "x-match": "all",
    "notification-type": "subscribe",
    "content-type": "video",
  },
});

sendNotification({
  message: {
    data: "Some unsubscribed your channel",
  },
  headers: {
    "x-match": "all",
    "notification-type": "unsubscribe",
    "content-type": "video",
  },
});

sendNotification({
  message: {
    data: "New video uploaded",
  },
  headers: {
    "x-match": "any",
    "notification-type": "new_video",
    "content-type": "video",
  },
});

sendNotification({
  message: {
    data: "Someone liked your video",
  },
  headers: {
    "x-match": "any",
    "notification-type-like": "like",
    "content-type": "video",
  },
});

sendNotification({
  message: {
    data: "Someone liked your comment",
  },
  headers: {
    "x-match": "any",
    "notification-type-comment": "like",
    "content-type": "comment",
  },
});
