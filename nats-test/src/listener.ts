import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
}); // stan stands for client here

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  /**
   * In NATS streaming, options are applied by chaining
   * Like, set manual acknowledgement mode to true acknowledges the message. The
   * publisher waits for acknowledgement, else sends the event to another listener of same
   * queue group
   */
  const options = stan.subscriptionOptions().setManualAckMode(true);

  const subscription = stan.subscribe(
    "ticket:created",
    "order-service-queue-group",
    options
  );
  // Queue Groups ensures that multiple copies of same listener don't receive the same message
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack(); // This is the acknowledgement
  });
});

// Following lines are required for gracefully shutting down client
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
