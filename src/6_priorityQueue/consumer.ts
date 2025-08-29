import amqp from "amqplib";
import { PRIORITY_QUEUE } from "./constant.js";

async function receiveMessage() {
  try {
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    await channel.consume(PRIORITY_QUEUE, (message) => {
      if (message !== null) {
        console.log(JSON.parse(message.content.toString()));
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

receiveMessage();
