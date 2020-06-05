import mongoose from "mongoose";
/**
 * An interface that describes the properties which are
 * required to create a new Ticket
 */
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

/**
 * An interface that describes the properties that a ticket model has
 */
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

/**
 * An interface that describes the properties that a ticket document has
 */
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
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
    },
    userId: {
      type: String,
      required: true,
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

ticketSchema.statics.build = (attr: TicketAttrs) => {
  return new Ticket(attrs);
};
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
