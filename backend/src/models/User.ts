import mongoose from "mongoose";

export interface UserTypes {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema<UserTypes>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", UserSchema);

export default User;
