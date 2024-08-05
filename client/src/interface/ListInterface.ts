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
	stateUpdated?: Date;
	token: string;
}

const listDefault: List = {
	_id: '',
	title: '',
	categories: [],
	items: [],
	deletedItems: [],
	boughtItems: [],
	users: [],
	updatedAt: '',
	createdAt: '',
	owner: false,
	token: '',
};

export { listDefault };

export default List;
