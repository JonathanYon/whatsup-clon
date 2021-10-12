import mongoose from 'mongoose'

const {Schema, model} = mongoose

export const MessageSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId,ref: "User",required: true, },
        /* owner: { type: mongoose.Types.ObjectId, ref: "User", required: true }, */
        content: {
            text: { type: String, required: true },
            media: { type: String, required: true },
        },
    },
    {
        timestamps: true
    }
)

/* export default model("Message", MessageSchema) */