import amqp from "amqplib";
import { NOTIFICATION_EXCHANGE } from "./constant.js";

interface Notification {
  routingPattern: string;
  message: object;
}
async function sendNotification({ routingPattern, message }: Notification) {
  try {
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    await channel.assertExchange(NOTIFICATION_EXCHANGE, "topic", {
      durable: true,
    });

    await channel.publish(
      NOTIFICATION_EXCHANGE,
      routingPattern,
      Buffer.from(JSON.stringify(message))
    );

    console.log("Message sent", message);

    setTimeout(async () => {
      await connection.close();
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}

sendNotification({
  routingPattern: "order.*",
  message: {
    orderId: 1,
    userId: 1,
  },
});

sendNotification({
  routingPattern: "payment.*",
  message: {
    paymentId: 1,
    userId: 1,
  },
});
