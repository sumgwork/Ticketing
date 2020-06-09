import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });
  new TicketCreatedListener(stan).listen();
});

// Following lines are required for gracefully shutting down client
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
