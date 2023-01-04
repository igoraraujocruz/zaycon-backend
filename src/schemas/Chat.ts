import { Schema, model, Document } from "mongoose";

interface Account extends Document {
    numberPhone: string;
    name: string;
    plataform: string;
}

const AccountSchema = new Schema({
    numberPhone: String,
    name: String,
    plataform: String
}, {
    timestamps: true
})

export default model<Account>('Account', AccountSchema)