const amqp = require("amqplib");

async function subscribeToChannel(channelNumber, exchangeName) {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Create a fanout exchange if it doesn't exist
    await channel.assertExchange(exchangeName, "fanout", { durable: false });

    // Create an anonymous, exclusive queue for this subscriber
    const { queue } = await channel.assertQueue("", { exclusive: true });

    // Bind the queue to the exchange
    channel.bindQueue(queue, exchangeName, "");

    // Receive and process messages
    channel.consume(
      queue,
      (message) => {
        if (message && message.content) {
          console.log(
            `Channel ${channelNumber} Received:`,
            message.content.toString()
          );
          channel.ack(message);
        }
      },
      { noAck: false }
    );

    console.log(`Waiting for messages on Channel ${channelNumber}...`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Call the subscribeToChannel function with different channel numbers and exchange names
subscribeToChannel(1, "my_exchange1");
subscribeToChannel(2, "my_exchange2");
