import amqp from "amqplib";
import {
  NOTIFICATION_EXCHANGE,
  PAYMENT_QUEUE,
  PAYMENT_ROUTING_PATTERN,
} from "./constant.js";

async function paymentConsumer() {
  try {
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    await channel.assertExchange(NOTIFICATION_EXCHANGE, "topic", {
      durable: true,
    });

    await channel.assertQueue(PAYMENT_QUEUE, { durable: true });

    await channel.bindQueue(
      PAYMENT_QUEUE,
      NOTIFICATION_EXCHANGE,
      PAYMENT_ROUTING_PATTERN
    );

    await channel.consume(
      PAYMENT_QUEUE,
      (message) => {
        if (message !== null) {
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

paymentConsumer();
