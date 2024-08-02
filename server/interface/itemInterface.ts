import { Document, ObjectId } from 'mongoose';
import { UserDocument } from './userInterface';


export interface Item {
	name: string;
	deleted: boolean;
	description?: string;
	unit: string;
	img?: string;
	category?: string;
	user: UserDocument | ObjectId;
}

export interface ItemDocument extends Item, Document {}