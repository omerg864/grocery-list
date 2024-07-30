import { Document } from 'mongoose';
import { UserDocument } from './userInterface';


export interface Item {
	name: string;
	description?: string;
	amount?: number;
	unit: string;
	img?: string;
	category?: string;
	user?: string | UserDocument;
}

export interface ItemDocument extends Item, Document {}