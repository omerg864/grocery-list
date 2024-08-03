import { Document, ObjectId } from 'mongoose';
import { UserDocument } from './userInterface';
import { ListItemDocument } from './listItemInterface';


export interface List {
	title: string;
	categories: string[];
	items: ListItemDocument[] | ObjectId[];
	deletedItems: ListItemDocument[] | ObjectId[];
	boughtItems: ListItemDocument[] | ObjectId[];
	users: ObjectId[] | UserDocument[];
    owner: ObjectId | UserDocument;
	deletedUsers: ObjectId[] | UserDocument[];
}

export interface ListDocument extends List, Document {}