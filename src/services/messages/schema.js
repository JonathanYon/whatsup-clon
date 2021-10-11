import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    sender: { type: String },
    content: {
      text: { type: String },
      media: { type: String },
    },
  },
  { timestamps: true }
);
export default model("Message", messageSchema);
