import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteEvent, OrderStatus } from "@sg-tickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // create a fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // create a fake message (msg) object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("updates the order status to cancelled", async () => {
  const { listener, data, msg, order } = await setup();
  // call the onMessage function with data and message objects
  await listener.onMessage(data, msg);

  const order = await Order.findById(order.id);
  expect(order).toBeDefined();
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
  const { listener, data, msg, order } = await setup();
  // call the onMessage function with data and message objects
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("Acknowledges a message", async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with data and message objects
  await listener.onMessage(data, msg);
  // assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
