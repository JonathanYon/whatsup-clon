import mongoose, { model } from 'mongoose'

const messageSchema = new mongoose.Schema(
    {
        sender: { type: String, required: true },
        content: {
            text: { type: String, required: true },
            media: { type: String, required: true },
        },
    },
    {
        timestamps: true
    }
)

export default model("Message", messageSchema)