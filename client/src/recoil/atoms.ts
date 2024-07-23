import { atom } from 'recoil';
import List from '../interface/ListInterface';
import Bundle from '../interface/BundleInterface';
import Item from '../interface/ItemInterface';

const listAtom = atom<List>({
	key: 'listState',
	default: {
		id: '1',
		title: 'Grocery Shopping',
		categories: ['Food', 'Home Essentials'],
		items: [{ id: '1', name: 'Apples', category: 'Fruits', amount: 2, unit: 'kg', description: 'Green apples' }],
		users: ['user123', 'user456'],
		updatedAt: '2021-10-01',
		createdAt: '2021-09-01',
		boughtItems: [],
		deletedItems: [],
		owner: true,
	},
});

const itemAtom = atom<Item>({
	key: 'itemState',
	default: {
		id: '1',
		name: 'Item 1',
		category: 'Fruits',
		amount: 2,
		unit: 'kg',
		description: 'Green apples',
	},
});

const bundleAtom = atom<Bundle>({
	key: 'bundleState',
	default: {
		id: '',
		title: '',
		items: [],
	},
});

const listsState = atom<List[]>({
	key: 'listsState',
	default: [
		{
			id: '1',
			title: 'Grocery Shopping',
			categories: ['Food', 'Home Essentials'],
			items: [{ id: '1', name: 'Apples', category: 'Fruits', amount: 2, unit: 'kg' , description: 'Green apples' }],
			users: ['user123', 'user456'],
			updatedAt: '2021-10-01',
			createdAt: '2021-09-01',
			boughtItems: [],
			deletedItems: [],
			owner: true,
		},
		{
			id: '2',
			title: 'Book Club',
			categories: ['Books', 'Entertainment'],
			items: [],
			users: ['user789', 'user234'],
			updatedAt: '2021-10-01',
			createdAt: '2021-09-24',
			boughtItems: [],
			deletedItems: [],
			owner: true,
		},
		{
			id: '3',
			title: 'Hardware Supplies',
			categories: ['Tools', 'Hardware'],
			items: [],
			users: ['user567', 'user890'],
			updatedAt: '2021-11-01',
			createdAt: '2021-09-02',
			boughtItems: [],
			deletedItems: [],
			owner: false,
		},
	],
});

export { listAtom, listsState, bundleAtom, itemAtom };
