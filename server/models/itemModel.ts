import * as mongoose from "mongoose";
import { ItemDocument } from "../interface/itemInterface";

const ItemScheme = new mongoose.Schema<ItemDocument>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    unit: {
        type: String
    },
    img: {
        type: String
    },
    category: {
        type: String
    },
    default: {
        type: Boolean,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

export default mongoose.model<ItemDocument>('Item', ItemScheme);