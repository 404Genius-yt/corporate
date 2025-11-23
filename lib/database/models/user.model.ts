import { model, models, Schema } from "mongoose";

export interface IUser {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  skill: string;
  resume?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  age: {
    type: Number,
  },
  skill: {
    type: String
  },
  resume: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt:{
    type: Date,
    default: Date.now
  },
})

export const User = models?.User || model("User", UserSchema);