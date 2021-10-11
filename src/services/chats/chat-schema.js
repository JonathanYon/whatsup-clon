import mongoose from 'mongoose'

const {Schema, model} = mongoose

const ChatSchema = new Schema({
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    history:[ { type: Schema.Types.ObjectId, ref: "Message" }]
})

export default model("Chat", ChatSchema)