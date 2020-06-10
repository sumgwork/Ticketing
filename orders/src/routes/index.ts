import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { NotFoundError } from "@sg-tickets/common";

const router = express.Router();

router.get("/api/orders", async (req: Request, res: Response) => {
  const orders = await Order.find({});
  res.send(orders);
});

export { router as indexOrderRouter };
