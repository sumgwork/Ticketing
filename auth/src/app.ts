import { errorHandler, NotFoundError } from "@sg-tickets/common";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors"; // imported for handling async route handlers
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.set("trust proxy", true); // For secure session
app.use(json());
app.use(
  cookieSession({
    signed: false, // no need to encrypt the content of the cookie
    // secure: true, // Should be true for https connection (will fail in test env)
    secure: process.env.NODE_ENV !== "test",
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

export { app };
