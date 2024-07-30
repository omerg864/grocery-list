import { Document } from 'mongoose';


export interface Receipt {
    img: string;
    createdAt: Date;
}

export interface ReceiptDocument extends Receipt, Document {}