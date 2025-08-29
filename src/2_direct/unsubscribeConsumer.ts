import amqp from "amqplib";
import { SENT_MAIL_TO_UNSUBSCRIBE_USERS_QUEUE } from "./constant.js";

async function unsubscribeConsumer() {
  try {
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    await channel.consume(SENT_MAIL_TO_UNSUBSCRIBE_USERS_QUEUE, (message) => {
      if (message !== null) {
        console.log(JSON.parse(message.content.toString()));
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

unsubscribeConsumer();
