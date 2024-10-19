import { Document, ObjectId } from 'mongoose';
import { ItemDocument } from './itemInterface';
import { UserDocument } from './userInterface';


export interface Bundle {
    title: string;
    description?: string;
    items: ItemDocument[] | ObjectId[];
    user: UserDocument | ObjectId;
}

export interface BundleDocument extends Bundle, Document {}