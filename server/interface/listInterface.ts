import { Document, ObjectId } from 'mongoose';
import { Item } from './itemInterface';
import { UserDocument } from './userInterface';


export interface List {
	title: string;
	categories: string[];
	items: Item[] | ObjectId[];
	deletedItems: Item[] | ObjectId[];
	boughtItems: Item[] | ObjectId[];
	users: ObjectId[] | UserDocument[];
    owner: ObjectId | UserDocument;
}

export interface ListDocument extends List, Document {}