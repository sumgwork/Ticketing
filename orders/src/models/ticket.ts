import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
/**
 * An interface that describes the properties which are
 * required to create a new Ticket
 */
interface TicketAttrs {
  id: string; // This ID would come from Ticket service
  title: string;
  price: number;
  //   version: number;
}

/**
 * An interface that describes the properties that a ticket model has
 */
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: String;
    version: number;
  }): Promise<TicketDoc | null>;
}

/**
 * An interface that describes the properties that a ticket document has
 */
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  /**
   * This method can determine whether a ticket is already reserved
   */
  isReserved(): Promise<boolean>;
  //   version: number;
  // Any extra property like createdAt, updatedAt will be applied here
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // version: {
    //   type: Number,
    // },
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = function (event: {
  id: string;
  version: number;
}) {
  return Ticket.findOne({ _id: event.id, version: event.version - 1 });
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this, // this === the ticket document that we just called 'isReserved' on
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
