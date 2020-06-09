import { Message } from "node-nats-streaming";
import { Listener, TicketUpdatedEvent, Subjects } from "@sg-tickets/common";
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = "payments-service";
  onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    console.log("Data received", data);
    // TODO:Business logic

    msg.ack(); // This is the acknowledgement
  }
}
