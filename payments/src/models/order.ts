import mongoose from "mongoose";
import { OrderStatus } from "@sg-tickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

/**
 * An interface that describes the properties which are
 * required to create a new Order
 */
interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

/**
 * An interface that describes the properties that a Order model has
 */
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

/**
 * An interface that describes the properties that a Order document has
 */
interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
  // Any extra property like createdAt, updatedAt will be applied here
  // dont include id here as it comes from mongoose document
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
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      // This will be invoked if we convert the object to a JSON.
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id; // Changed _id to id
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    status: attrs.status,
    price: attrs.price,
    userId: attrs.userId,
  });
};
const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
