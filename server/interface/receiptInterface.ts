import { Document, ObjectId } from 'mongoose';
import { ListDocument } from './listInterface';


export interface Receipt {
    img: string;
    createdAt: Date;
    list: ListDocument | ObjectId;
}

export interface ReceiptDocument extends Receipt, Document {}