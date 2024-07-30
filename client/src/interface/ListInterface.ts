import Item from './ItemInterface';

interface List {
	id: string;
	title: string;
	categories: string[];
	items: Item[];
	deletedItems: Item[];
	boughtItems: Item[];
	users: string[];
    updatedAt: string;
    createdAt: string;
	owner: boolean;
}

export default List;
