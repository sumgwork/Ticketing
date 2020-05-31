import express from "express";
import "express-async-errors"; // imported for handling async route handlers
import cookieSession from "cookie-session";

import { json } from "body-parser";
import mongoose from "mongoose";

import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { currentUserRouter } from "./routes/current-user";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.set("trust proxy", true); // For secure session
app.use(json());
app.use(
  cookieSession({
    signed: false, // no need to encrypt the content of the cookie
    secure: true, // Should be true for https connection
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Case where user hits an invalid route (all -> get, post etc.)
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  try {
    const mongoUrl = "mongodb://auth-mongo-srv:27017/auth";
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to Auth Mongo DB");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("listening on port 3000!");
  });
};

start();
