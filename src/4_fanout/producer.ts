import amqp from "amqplib";
import { NEW_PRODUCT_LAUNCH_EXCHANGE } from "./constant.js";

async function sendNewProductLaunch(product) {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange(NEW_PRODUCT_LAUNCH_EXCHANGE, "fanout", {
      durable: true,
    });

    await channel.publish(
      NEW_PRODUCT_LAUNCH_EXCHANGE,
      "",
      Buffer.from(JSON.stringify(product))
    );

    setTimeout(async () => {
      await connection.close();
    }, 1000);
  } catch (error) {
    console.error(error);
  }
}

sendNewProductLaunch({
  name: "Product 1",
  price: 100,
  category: "Electronics",
});
