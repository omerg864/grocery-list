

interface Lists {
	_id: string;
	title: string;
	categories: string[];
	items: number;
	deletedItems: number;
	boughtItems:number;
    updatedAt: string;
    createdAt: string;
	owner: boolean;
}

export default Lists;
