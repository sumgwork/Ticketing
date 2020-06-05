import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@sg-tickets/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

const validations = [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
];

router.post(
  "/api/tickets",
  requireAuth,
  validations,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = new Ticket({ title, price, userId: req.currentUser!.id });
    // const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
