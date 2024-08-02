import * as mongoose from 'mongoose';
import { ListDocument } from '../interface/listInterface';

const ListScheme = new mongoose.Schema<ListDocument>(
	{
		title: {
			type: String,
			required: true,
		},
		categories: [
			{
				type: String,
			},
		],
		items: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'ListItem',
			},
		],
		deletedItems: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'ListItem',
			},
		],
		boughtItems: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'ListItem',
			},
		],
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
		],
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model<ListDocument>('List', ListScheme);
