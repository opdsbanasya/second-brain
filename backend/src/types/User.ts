import type mongoose from "mongoose";

export interface UserTypes {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserInputRegister = Omit<UserTypes, "_id" | "createdAt" | "updatedAt">;
export type UserInputLogin = Pick<UserTypes, "email" | "password">;