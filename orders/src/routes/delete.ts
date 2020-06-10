import {
  NotAuthorisedError,
  NotFoundError,
  requireAuth,
} from "@sg-tickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
// import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { Order, OrderStatus } from "../models/order";
// import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish an event

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
