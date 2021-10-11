import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  history: {
    type: [
      {
        sender: { type: String },
        content: {
          text: { type: String },
          media: { type: String },
        },
      },
    ],
    default: [],
  },
});

chatSchema.statics.initiateChat = async function (members, chatInitiator) {
  try {
    const availableRoom = await this.findOne({
      members: {
        $size: members.length,
        $all: [...members],
      },
    });
    if (availableRoom) {
      return {
        isNew: false,
        message: "retrieving an old chat room",
        chatRoomId: availableRoom._doc._id,
      };
    }

    const newRoom = await this.create({ members, chatInitiator });
    return {
      isNew: true,
      message: "creating a new chatroom",
      chatRoomId: newRoom._doc._id,
    };
  } catch (error) {
    console.log("error on start chat method", error);
    throw error;
  }
};

export default model("Chat", chatSchema);
