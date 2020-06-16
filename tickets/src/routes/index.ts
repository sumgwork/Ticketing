import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@sg-tickets/common";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({ orderId: undefined });

  res.send(tickets);
});

export { router as indexTicketRouter };
