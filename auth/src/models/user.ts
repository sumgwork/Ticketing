import mongoose from "mongoose";
import { Password } from "../services/password";
/**
 * An interface that describes the properties which are
 * required to create a new User
 */
interface UserAttrs {
  email: string;
  password: string;
}

/**
 * An interface that describes the properties that a user model has
 */
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

/**
 * An interface that describes the properties that a user document has
 */
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // Any extra property like createdAt, updatedAt will be applied here
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // This will be invoked if we convert the object to a JSON. Doing this here so that we never get the password back
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id; // Changed _id to id
        delete ret.password;
        delete ret.__v; // Removed version key. Another way was to set it false in options (3rd arg)
      },
    },
  }
);

/**
 * This hook will be called when saving a password
 * Used here for hashing the password before saving to the DB
 */
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
