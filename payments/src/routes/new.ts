import {
  BadRequestError,
  NotAuthorisedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@sg-tickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";

const router = express.Router();

const bodyValidations = [
  body("token").not().isEmpty().withMessage("Stripe token is required"),
  body("orderId")
    .not()
    .isEmpty()
    // .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("Order Id is required"),
];

router.post(
  "/api/payments",
  requireAuth,
  bodyValidations,
  validateRequest,
  async (req: Request, res: Response) => {
    // Find the order
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    // Make sure the order belongs to this user
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }
    // Ensure the order is yet not cancelled
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order is already cancelled");
    }
    // Make sure the payment amount matches
    // Verify Payment with stripe API
    // Create 'Charge' record for successful payment
    res.send({ success: true });
  }
);

export { router as CreateChargeRouter };
