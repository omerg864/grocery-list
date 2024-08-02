import ListItem from './ListItemInterface';

interface List {
	_id: string;
	title: string;
	categories: string[];
	items: ListItem[];
	deletedItems: ListItem[];
	boughtItems: ListItem[];
	users: string[];
    updatedAt: string;
    createdAt: string;
	owner: boolean;
}

export default List;
