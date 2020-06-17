import { BadRequestError, validateRequest } from "@sg-tickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const router = express.Router();
const signupValidation = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];

router.post(
  "/api/users/signup",
  signupValidation,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }
    // const user = User.build({ email, password });
    console.log("Signing up a new user!");
    const user = new User({ email, password });
    await user.save();

    //Generate token
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // This ! conveys to TS that we have already ensured this key is defined (in index.ts)
    );
    // @ts-ignore
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
