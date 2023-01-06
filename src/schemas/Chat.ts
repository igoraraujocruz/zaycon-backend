import { Schema, model, Document } from "mongoose";

interface Account extends Document {
    referencePoint: string;
    name: string;
    platform: string;
}

const AccountSchema = new Schema({
    referencePoint: String,
    name: String,
    platform: String
}, {
    timestamps: true
})

export default model<Account>('Account', AccountSchema)