import amqp from "amqplib";
import {
  MAIL_EXCHANGE,
  MAIL_QUEUE,
  SEND_MAIL_ROUTING_KEY,
} from "./constant.js";
async function sendMail(message: object) {
  try {
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    await channel.assertExchange(MAIL_EXCHANGE, "direct", { durable: true });

    await channel.assertQueue(MAIL_QUEUE, { durable: true });

    await channel.bindQueue(MAIL_QUEUE, MAIL_EXCHANGE, SEND_MAIL_ROUTING_KEY);

    await channel.publish(
      MAIL_EXCHANGE,
      SEND_MAIL_ROUTING_KEY,
      Buffer.from(JSON.stringify(message))
    );
    console.log("Message sent", message);

    setTimeout(async () => {
      await connection.close();
    }, 1000);
  } catch (error) {
    console.log(error);
  }
}

sendMail({
  to: "vipin@gmail.com",
  from: "kumawat@gmail.com",
  subject: "hello",
  body: "Hello Vipin",
});
