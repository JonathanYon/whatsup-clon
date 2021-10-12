import mongoose from 'mongoose'
import {MessageSchema} from './message-schema.js'

const {Schema, model} = mongoose

const ChatSchema = new Schema({
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    /* owner: { type: mongoose.Types.ObjectId, ref: "User", required: true }, */
    history:{
        type:[MessageSchema],
    default:[]
    }
})

export default model("Chat", ChatSchema)