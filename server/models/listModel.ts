import * as mongoose from "mongoose";
import { ListDocument } from "../interface/listInterface";

const ListScheme = new mongoose.Schema<ListDocument>({
    title: {
        type: String,
        required: true
    },
    categories: [{
        type: String
    }],
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    deletedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    boughtItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export default mongoose.model<ListDocument>('List', ListScheme);