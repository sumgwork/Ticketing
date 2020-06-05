import { BadRequestError, validateRequest } from "@sg-tickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();
const signinValidation = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password must be between 4 and 20 characters"),
];

router.post(
  "/api/users/signin",
  signinValidation,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    const match = await Password.compare(existingUser.password, password);
    if (!match) {
      throw new BadRequestError("Invalid credentials");
    }
    //Generate token
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY! // This ! conveys to TS that we have already ensured this key is defined (in index.ts)
    );
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
