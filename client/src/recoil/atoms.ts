import { atom } from 'recoil';
import List from '../interface/ListInterface';

const listAtom = atom<List | undefined>({
	key: 'listState',
	default: undefined,
});

const listsState = atom<List[]>({
	key: 'listsState',
	default: [
		{
			id: '1',
			title: 'Grocery Shopping',
			categories: ['Food', 'Home Essentials'],
			items: [],
			users: ['user123', 'user456'],
			updatedAt: '2021-10-01',
			createdAt: '2021-09-01',
			boughtItems: [],
			deletedItems: [],
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
		},
	],
});

export { listAtom, listsState };
