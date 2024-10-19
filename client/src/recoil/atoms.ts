import { atom } from 'recoil';
import List, { listDefault } from '../interface/ListInterface';
import Bundle from '../interface/BundleInterface';
import Item, { itemDefault } from '../interface/ItemInterface';
import Lists from '../interface/ListsInterface';
import ListItem from '../interface/ListItemInterface';
import { bundleDefault } from '../interface/BundleInterface';

const listAtom = atom<List>({
	key: 'listState',
	default: listDefault,
});

const itemAtom = atom<Item | ListItem>({
	key: 'itemState',
	default: itemDefault,
});

const bundleAtom = atom<Bundle>({
	key: 'bundleState',
	default: bundleDefault,
});


const bundlesAtom = atom<Bundle[]>({
	key: 'bundlesState',
	default: [],
});

const updatedBundlesAtom = atom<Date>(
	{
		key: 'updatedBundles',
		default: new Date(),
	}
)

const itemsDataAtom = atom<{
	items: Item[],
	categories: string[],
	updated: Date,
}>({
	key: 'itemsData',
	default: {
		items: [],
		categories: [],
		updated: new Date(),
	}
});

const listsState = atom<Lists[]>({
	key: 'listsState',
	default: []
});

const updatedListsAtom = atom<Date>(
	{
		key: 'updatedLists',
		default: new Date(),
	}
)

export { listAtom, listsState, bundleAtom, itemAtom, bundlesAtom, updatedBundlesAtom, updatedListsAtom, itemsDataAtom };
