import { Schema, model, Document } from "mongoose";

interface Message extends Document {
    accountId: string;
    message: string;
}

const MessageSchema = new Schema({
    accountId: String,
    message: String,
}, {
    timestamps: true
})

export default model<Message>('Message', MessageSchema)