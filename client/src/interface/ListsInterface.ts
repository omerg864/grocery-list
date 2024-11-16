

interface Lists {
	_id: string;
	title: string;
	items: number;
	users: number;
	deletedItems: number;
	boughtItems:number;
    updatedAt: string;
    createdAt: string;
	owner: boolean;
	stateUpdated?: Date;
	archived?: boolean;
}

export const listsDefault: Lists = {
	_id: '',
	title: '',
	items: 0,
	deletedItems: 0,
	boughtItems: 0,
	updatedAt: '',
	createdAt: '',
	users: 1,
	owner: false,
}

export default Lists;
