import { Document, ObjectId } from 'mongoose';
import { List } from './listInterface';


export interface ListItem {
	name: string;
	deleted: boolean;
	description?: string;
	amount: number;
	unit: string;
	img?: string;
	category?: string;
    list: ObjectId | List;
}

export interface ListItemDocument extends ListItem, Document {}