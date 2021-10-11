import mongoose, { model } from "mongoose";

const { Schema, module } = mongoose;

const UsersSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    avatar: {
      type: String,
      required: false,
      default: "https://bit.ly/3lBk8d3",
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default module("User", UsersSchema);
