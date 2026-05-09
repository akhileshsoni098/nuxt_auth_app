import mongoose from "mongoose";
import { Document,Types } from "mongoose";

export interface IUser extends Document {
 _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  age: number;
  is_married: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    age: {
      type: Number,
    },
    is_married: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
