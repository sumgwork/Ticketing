import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@sg-tickets/common";

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
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export { router as createTicketRouter };
