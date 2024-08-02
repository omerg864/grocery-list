import * as mongoose from "mongoose";
import { BundleDocument } from "../interface/bundleInterface";

const BundleScheme = new mongoose.Schema<BundleDocument>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model<BundleDocument>('Bundle', BundleScheme);