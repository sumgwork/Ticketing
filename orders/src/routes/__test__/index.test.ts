import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const createTicket = async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  return ticket;
};

const createOrder = async (ticket, user) => {
  const order = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket._id });
  return order;
};

it("fetches orders for a particular user", async () => {
  // Create three tickets
  const ticket1 = await createTicket();
  const ticket2 = await createTicket();
  const ticket3 = await createTicket();

  // Create 1 order as user#1
  const user1 = global.signin();
  const { body: order1 } = await createOrder(ticket1, user1);

  // Create 1 order as user#2
  const user2 = global.signin();
  const { body: order2 } = await createOrder(ticket2, user2);
  const { body: order3 } = await createOrder(ticket3, user2);

  // Make request to get orders for user#2
  const response = await request(app)
    .get(`/api/orders`)
    .set("Cookie", user2)
    .expect(200);
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order2.id);
  expect(response.body[1].id).toEqual(order3.id);
  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
