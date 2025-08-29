import amqp from "amqplib";
import { MAIL_QUEUE } from "./constant.js";

async function receiveMail() {
  try {
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    await channel.consume(MAIL_QUEUE, (message) => {
      if (message !== null) {
        console.log(JSON.parse(message.content.toString()));
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

receiveMail();
