import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined.");
    }
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined.");
    }
    const mongoUrl = process.env.MONGO_URI;
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
