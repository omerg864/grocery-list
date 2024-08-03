import * as mongoose from "mongoose";
import { ListItemDocument } from '../interface/listItemInterface';

const ListItemScheme = new mongoose.Schema<ListItemDocument>({
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
    amount: {
        type: Number
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    }
}, { timestamps: true });

export default mongoose.model<ListItemDocument>('ListItem', ListItemScheme);