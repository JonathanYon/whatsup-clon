import mongoose from 'mongoose'

const {Schema, model} = mongoose

const ChatSchema = new Schema({
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    history:[ { sender: { type: Schema.Types.ObjectId,ref: "User",required: true, },
    content: {
        text: { type: String, required: true },
        media: { type: String, required: true },
    }}]
})

export default model("Chat", ChatSchema)