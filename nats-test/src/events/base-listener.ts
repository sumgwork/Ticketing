import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

/**
 * For any event to be valid, it has to have a valid subject
 */
interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  queueGroupName = "payments-service"; // Queue Groups ensures that multiple copies of same listener don't receive the same message
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;

  private client: Stan; // stan stands for client here
  protected ackWait = 5 * 1000; //5 sec by default, can be overwritten by child classes

  constructor(client: Stan) {
    this.client = client;
  }

  /**
   * In NATS streaming, options are applied by chaining
   * Like, set manual acknowledgement mode to true acknowledges the message. The
   * publisher waits for acknowledgement, else sends the event to another listener of same
   * queue group
   */
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // In case of failure, on recovery, send all the events missed out
      .setManualAckMode()
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName); // to identify service with a durable name, events delivered in past would be marked
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg); // passing second parameter for future sake, to cover to any left out case
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8")); // Case when we receive a Buffer
  }
}
