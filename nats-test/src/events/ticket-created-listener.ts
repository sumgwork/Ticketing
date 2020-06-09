import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";

export class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  onMessage(data: any, msg: Message) {
    console.log("Data received", data);
    // TODO:Business logic
    msg.ack(); // This is the acknowledgement
  }
}
