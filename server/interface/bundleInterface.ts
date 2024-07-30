import { Document } from 'mongoose';
import { Item } from './itemInterface';


export interface Bundle {
    title: string;
    description?: string;
    items: Item[];
}

export interface BundleDocument extends Bundle, Document {}