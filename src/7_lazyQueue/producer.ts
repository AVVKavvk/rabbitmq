import amqp from "amqplib";
import { LAZY_EXCHANGE, LAZY_QUEUE, LAZY_ROUTING_PATTERN } from "./constant.js";
export const connection = await amqp.connect("amqp://localhost");
async function sendLazyMessage(message: object) {
  try {
    const channel = await connection.createChannel();

    await channel.assertExchange(LAZY_EXCHANGE, "direct", { durable: true });

    await channel.assertQueue(LAZY_QUEUE, {
      durable: true,
      arguments: {
        "x-queue-mode": "lazy",
      },
    });

    await channel.bindQueue(
      LAZY_QUEUE,
      LAZY_EXCHANGE,
      LAZY_ROUTING_PATTERN,
      {}
    );

    await channel.publish(
      LAZY_EXCHANGE,
      LAZY_ROUTING_PATTERN,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      }
    );
    await channel.close();
  } catch (error) {
    console.error(error);
  }
}

let size = 100000;
// let size = 1;
for (let i = 0; i < size; i++) {
  sendLazyMessage({
    type: "lazy",
    data: "Message",
  });
}
