import amqp from "amqplib";
import { LAZY_QUEUE } from "./constant.js";

const connection = await amqp.connect("amqp://localhost");
async function consumerLazyMessage() {
  try {
    const channel = await connection.createChannel();

    await channel.consume(
      LAZY_QUEUE,
      async (mess) => {
        try {
          if (mess !== null) {
            console.log(JSON.parse(mess.content.toString()));
            channel.ack(mess);
          }
        } catch (error) {
          console.error({ error });
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

consumerLazyMessage();
