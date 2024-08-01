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
    amount: {
        type: Number
    },
    unit: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    category: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model<ItemDocument>('Item', ItemScheme);