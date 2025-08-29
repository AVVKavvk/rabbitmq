import amqp from "amqplib";
import {
  PRIORITY_EXCHANGE,
  PRIORITY_QUEUE,
  PRIORITY_ROUTING_PATTERN,
} from "./constant.js";

async function sendMessage() {
  try {
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    await channel.assertExchange(PRIORITY_EXCHANGE, "direct", {
      durable: true,
    });
    await channel.assertQueue(PRIORITY_QUEUE, {
      durable: true,
      arguments: {
        "x-max-priority": 10,
      },
    });

    await channel.bindQueue(
      PRIORITY_QUEUE,
      PRIORITY_EXCHANGE,
      PRIORITY_ROUTING_PATTERN
    );
    const data = [
      {
        name: "John",
        age: 30,
        type: "Low",
        priority: 1,
      },
      {
        name: "Jane",
        age: 25,
        type: "High",
        priority: 8,
      },
      {
        name: "Bob",
        age: 20,
        type: "Medium",
        priority: 3,
      },
    ];

    data.map(async (mess) => {
      await channel.publish(
        PRIORITY_EXCHANGE,
        PRIORITY_ROUTING_PATTERN,
        Buffer.from(JSON.stringify(mess)),
        {
          persistent: true,
          priority: mess.priority,
        }
      );
    });

    setTimeout(async () => {
      await connection.close();
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}

sendMessage();
