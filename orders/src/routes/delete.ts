import {
  NotAuthorisedError,
  NotFoundError,
  requireAuth,
} from "@sg-tickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
// import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
// import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    // const ticket = await Ticket.findById(req.params.id);
    // if (!ticket) {
    //   throw new NotFoundError();
    // }
    // if (ticket.userId !== req.currentUser!.id) {
    //   throw new NotAuthorisedError();
    // }
    // ticket.set({
    //   title: req.body.title,
    //   price: req.body.price,
    // });
    // await ticket.save();
    //Publish event
    // Prefer fetching values from the object saved to DB than from the req body
    // new TicketUpdatedPublisher(natsWrapper.client).publish({
    //   id: ticket.id,
    //   title: ticket.title,
    //   price: ticket.price,
    //   userId: ticket.userId,
    // });
    // res.send(ticket);
  }
);

export { router as deleteOrderRouter };
