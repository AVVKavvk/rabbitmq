import amqp from "amqplib";
import {
  MAIL_EXCHANGE,
  SENT_MAIL_TO_SUBSCRIBE_USERS_QUEUE,
  SENT_MAIL_TO_SUBSCRIBE_USERS_ROUTING_KEY,
  SENT_MAIL_TO_UNSUBSCRIBE_USERS_QUEUE,
  SENT_MAIL_TO_UNSUBSCRIBE_USERS_ROUTING_KEY,
} from "./constant.js";

async function sendMail() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertExchange(MAIL_EXCHANGE, "direct", { durable: true });

  await channel.assertQueue(SENT_MAIL_TO_SUBSCRIBE_USERS_QUEUE, {
    durable: true,
  });
  await channel.assertQueue(SENT_MAIL_TO_UNSUBSCRIBE_USERS_QUEUE, {
    durable: true,
  });

  await channel.bindQueue(
    SENT_MAIL_TO_SUBSCRIBE_USERS_QUEUE,
    MAIL_EXCHANGE,
    SENT_MAIL_TO_SUBSCRIBE_USERS_ROUTING_KEY
  );
  await channel.bindQueue(
    SENT_MAIL_TO_UNSUBSCRIBE_USERS_QUEUE,
    MAIL_EXCHANGE,
    SENT_MAIL_TO_UNSUBSCRIBE_USERS_ROUTING_KEY
  );

  const subscribeMessage = {
    to: "vipin@gmail.com",
    from: "kumawat@gmail.com",
    subject: "hello",
    body: "Hello Vipin",
    type: "subscribe",
  };

  const unsubscribeMessage = {
    to: "vipin@gmail.com",
    from: "kumawat@gmail.com",
    subject: "hello",
    body: "Hello Vipin",
    type: "unsubscribe",
  };

  await channel.publish(
    MAIL_EXCHANGE,
    SENT_MAIL_TO_SUBSCRIBE_USERS_ROUTING_KEY,
    Buffer.from(JSON.stringify(subscribeMessage))
  );
  console.log("Message sent to subscribe users", subscribeMessage);

  await channel.publish(
    MAIL_EXCHANGE,
    SENT_MAIL_TO_UNSUBSCRIBE_USERS_ROUTING_KEY,
    Buffer.from(JSON.stringify(unsubscribeMessage))
  );

  console.log("Message sent to unsubscribe users", unsubscribeMessage);
  setTimeout(async () => {
    await connection.close();
  }, 1000);
  try {
  } catch (error) {
    console.error(error);
  }
}

sendMail();
