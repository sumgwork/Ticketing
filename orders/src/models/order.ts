import mongoose from "mongoose";
import { OrderStatus } from "@sg-tickets/common";
import { TicketDoc } from "./ticket";

export { OrderStatus }; // Exporting this so that in ticket model it can be imported straight from order model
/**
 * An interface that describes the properties which are
 * required to create a new Ticket
 */
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

/**
 * An interface that describes the properties that a ticket model has
 */
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

/**
 * An interface that describes the properties that a ticket document has
 */
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  // Any extra property like createdAt, updatedAt will be applied here
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      // This will be invoked if we convert the object to a JSON.
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id; // Changed _id to id
        delete ret.__v; // Removed version key. Another way was to set it false in options (3rd arg)
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};
const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
