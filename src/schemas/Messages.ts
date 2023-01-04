import { Schema, model, Document } from "mongoose";

interface Message extends Document {
    accountId: string;
    message: string;
    isClient: boolean;
}

const MessageSchema = new Schema({
    accountId: String,
    message: String,
    isClient: Boolean,
}, {
    timestamps: true
})

export default model<Message>('Message', MessageSchema)