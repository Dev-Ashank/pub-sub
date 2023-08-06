const amqp = require("amqplib");

async function connectAndPublish() {
  try {
    const connection = await amqp.connect("amqp://localhost");

    // Create the first channel for the first message
    const channel1 = await connection.createChannel();
    const exchangeName1 = "my_exchange1";
    const routingKey1 = "my_routing_key";

    // Create a fanout exchange if it doesn't exist
    await channel1.assertExchange(exchangeName1, "fanout", { durable: false });

    // Publish the first message to the exchange
    const message1 = "Hello, subscribers! This Message is from Publisher 1";
    channel1.publish(exchangeName1, routingKey1, Buffer.from(message1));
    console.log("Message sent:", message1);

    // Create the second channel for continuous publishing
    const channel2 = await connection.createChannel();
    const exchangeName2 = "my_exchange2";
    const routingKey2 = "my_routing_key";

    // Create a fanout exchange if it doesn't exist (you can skip this if already created)
    await channel2.assertExchange(exchangeName2, "fanout", { durable: false });

    // Publish a message to the exchange every 5 seconds
    setInterval(() => {
      const message2 = `Hello, subscribers! This Message is from Publisher  at ${new Date().toISOString()}`;
      channel2.publish(exchangeName2, "", Buffer.from(message2));
      console.log("Message sent:", message2);
    }, 5000);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

connectAndPublish();
