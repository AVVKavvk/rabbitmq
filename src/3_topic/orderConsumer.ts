import amqp from "amqplib";
import {
  NOTIFICATION_EXCHANGE,
  ORDER_QUEUE,
  ORDER_ROUTING_PATTERN,
} from "./constant.js";

async function orderConsumer() {
  try {
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    await channel.assertExchange(NOTIFICATION_EXCHANGE, "topic", {
      durable: true,
    });

    await channel.assertQueue(ORDER_QUEUE, { durable: true });

    await channel.bindQueue(
      ORDER_QUEUE,
      NOTIFICATION_EXCHANGE,
      ORDER_ROUTING_PATTERN
    );

    await channel.consume(
      ORDER_QUEUE,
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

orderConsumer();
