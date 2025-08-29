import amqp from "amqplib";
import { NEW_PRODUCT_LAUNCH_EXCHANGE } from "./constant.js";

async function consumeSMSNotification() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange(NEW_PRODUCT_LAUNCH_EXCHANGE, "fanout", {
      durable: true,
    });

    const queue = await channel.assertQueue("", {
      exclusive: true,
    });

    const queueName = queue.queue;
    console.log(queue);

    await channel.bindQueue(queueName, NEW_PRODUCT_LAUNCH_EXCHANGE, "");

    await channel.consume(
      queueName,
      (message) => {
        if (message !== null) {
          console.log("SMS Notification");

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

consumeSMSNotification();
