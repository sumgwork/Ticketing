import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined.");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined.");
  }
  const mongoUrl = process.env.MONGO_URI;
  try {
    await natsWrapper.connect("ticketing", "sjfsf", "http://nats-srv:4222");

    // Following lines are required for gracefully shutting down client
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

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
