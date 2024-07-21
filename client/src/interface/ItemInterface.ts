interface Item {
	id: string;
	name: string;
	description?: string;
	amount: number;
	unit: string;
	img?: string;
	category?: string;
}

export default Item;
