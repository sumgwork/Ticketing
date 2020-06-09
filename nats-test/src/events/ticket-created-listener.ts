import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Data received", data);
    // TODO:Business logic

    msg.ack(); // This is the acknowledgement
  }
}
