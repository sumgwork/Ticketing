import express from "express";
import "express-async-errors"; // imported for handling async route handlers

import { json } from "body-parser";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { currentUserRouter } from "./routes/current-user";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Case where user hits an invalid route (all -> get, post etc.)
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("listening on port 3000!");
});
