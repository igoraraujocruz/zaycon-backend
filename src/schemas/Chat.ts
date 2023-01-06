import { Schema, model, Document } from "mongoose";

interface Account extends Document {
    referencePoint: string;
    name: string;
    plataform: string;
}

const AccountSchema = new Schema({
    referencePoint: String,
    name: String,
    plataform: String
}, {
    timestamps: true
})

export default model<Account>('Account', AccountSchema)