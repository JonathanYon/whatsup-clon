import mongoose, { model } from 'mongoose'

const chatSchema = new mongoose.Schema({
    members: { type: Schema.Types.ObjectId, ref: "User" },
    history: { type: Schema.Types.ObjectId, ref: "Message" }
})

export default model("Chat", chatSchema)