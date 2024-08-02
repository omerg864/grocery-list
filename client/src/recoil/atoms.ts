import { atom } from 'recoil';
import List from '../interface/ListInterface';
import Bundle from '../interface/BundleInterface';
import Item from '../interface/ItemInterface';
import Lists from '../interface/ListsInterface';
import ListItem from '../interface/ListItemInterface';

const listAtom = atom<List>({
	key: 'listState',
	default: {
		_id: '',
		title: '',
		categories: [],
		items: [],
		users: [],
		updatedAt: '',
		createdAt: '',
		boughtItems: [],
		deletedItems: [],
		owner: false,
	},
});

const itemAtom = atom<Item | ListItem>({
	key: 'itemState',
	default: {
		_id: '',
		name: '',
		category: '',
		amount: 0,
		unit: 'pc',
		description: '',
	},
});

const bundleAtom = atom<Bundle>({
	key: 'bundleState',
	default: {
		_id: '',
		title: '',
		items: [],
	},
});

const listsState = atom<Lists[]>({
	key: 'listsState',
	default: []
});

export { listAtom, listsState, bundleAtom, itemAtom };
