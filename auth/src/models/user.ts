import mongoose from "mongoose";

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

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attr: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
