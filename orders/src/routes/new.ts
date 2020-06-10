import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@sg-tickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
// import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes

const router = express.Router();

const validations = [
  body("ticketId")
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // Id should be a valid mongoose id
    .withMessage("Ticket Id is required"),
];

router.post(
  "/api/orders",
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    // Fetch the ticket that the user is trying to purchase
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure the ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = new Order({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    // const order = Order.build({
    //   userId: req.currentUser!.id,
    //   status: OrderStatus.Created,
    //   expiresAt: expiration,
    //   ticket,
    // });
    await order.save();

    // Publish an event that an order has been created

    // await new TicketCreatedPublisher(natsWrapper.client).publish({
    //   id: ticket.id,
    //   title: ticket.title,
    //   price: ticket.price,
    //   userId: ticket.userId,
    // });
    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
