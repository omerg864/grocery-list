import { Document, ObjectId } from 'mongoose';
import { Item } from './itemInterface';
import { UserDocument } from './userInterface';


export interface Bundle {
    title: string;
    description?: string;
    items: Item[];
    user: UserDocument | ObjectId;
}

export interface BundleDocument extends Bundle, Document {}