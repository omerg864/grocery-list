

interface Lists {
	_id: string;
	title: string;
	categories: string[];
	items: number;
	users: number;
	deletedItems: number;
	boughtItems:number;
    updatedAt: string;
    createdAt: string;
	owner: boolean;
	stateUpdated?: Date;
}

export default Lists;
