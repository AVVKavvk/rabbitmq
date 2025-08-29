import amqp from "amqplib";
import { HEADERS_EXCHANGE } from "./constant.js";

async function subscribeConsumer() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange(HEADERS_EXCHANGE, "headers", {
      durable: true,
    });

    const queue = await channel.assertQueue("", {
      durable: true,
      exclusive: true,
    });

    await channel.bindQueue(queue.queue, HEADERS_EXCHANGE, "", {
      "x-match": "all",
      "notification-type": "subscribe",
      "content-type": "video",
    });

    await channel.consume(
      queue.queue,
      (message) => {
        if (message !== null) {
          console.log("Subscribe Notification");
          console.log(JSON.parse(message.content.toString()));
          channel.ack(message);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error(error);
  }
}
subscribeConsumer();
