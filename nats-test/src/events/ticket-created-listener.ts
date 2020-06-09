import { Message } from "node-nats-streaming";
import { Listener, TicketCreatedEvent, Subjects } from "@sg-tickets/common";
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = "payments-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Data received", data);
    // TODO:Business logic

    msg.ack(); // This is the acknowledgement
  }
}
