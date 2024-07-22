import User from './UserInterface';

interface Item {
	id: string;
	name: string;
	description?: string;
	amount?: number;
	unit: string;
	img?: string;
	category?: string;
	user?: string | User;
}

export default Item;
