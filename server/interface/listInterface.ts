import { Document } from 'mongoose';
import { Item } from './itemInterface';
import { UserDocument } from './userInterface';


export interface List {
	title: string;
	categories: string[];
	items: Item[];
	deletedItems: Item[];
	boughtItems: Item[];
	users: string[] | UserDocument[];
    owner: string | UserDocument;
}

export interface ListDocument extends List, Document {}