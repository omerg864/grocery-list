import * as mongoose from "mongoose";
import { ReceiptDocument } from "../interface/receiptInterface";

const ReceiptScheme = new mongoose.Schema<ReceiptDocument>({
    img: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model<ReceiptDocument>('Receipt', ReceiptScheme);