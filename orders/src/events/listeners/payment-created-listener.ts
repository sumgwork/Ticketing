import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@sg-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { id, stripeId, orderId } = data;
    /**
     * For future proofing, this stripeId (or charge id) can be stored in DB
     */
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    /**
     * Once order goes to completion, it is not touched ever again. Optionally, we can publish an event about order updation here.
     */

    msg.ack();
  }
}
