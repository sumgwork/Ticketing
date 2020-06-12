import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const createTicket = async () => {
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
    .send({ ticketId: ticket._id })
    .expect(201);
  return order;
};

it("throws 404 if order is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/orders/${id}`)
    .set("Cookie", global.signin())
    .expect(404);
});

it("throws error if order does not belong to the user", async () => {
  const ticket1 = await createTicket();
  const user1 = global.signin();
  const user2 = global.signin();

  const { body: order1 } = await createOrder(ticket1, user1);

  await request(app)
    .get(`/api/orders/${order1.id}`)
    .set("Cookie", user2)
    .expect(401);
});

it("fetches details of a particular order", async () => {
  const ticket1 = await createTicket();
  const user1 = global.signin();

  const { body: order1 } = await createOrder(ticket1, user1);

  // Make request to get orders for user#2
  const response = await request(app)
    .get(`/api/orders/${order1.id}`)
    .set("Cookie", user1)
    .expect(200);

  expect(response.body.id).toEqual(order1.id);
});
