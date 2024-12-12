import { ReactNode } from "react";

interface Item {
	_id: string;
	name: string;
	description?: string;
	unit: string;
	img?: string;
	user?: string;
	category?: string;
	imageMemo?: ReactNode;
	stateUpdated?: Date;
	default: boolean | null;
}

export const itemDefault: Item = {
	_id: '',
	name: '',
	unit: 'pc',
	user: '',
	default: false
};


export interface ItemNew {
	name: string;
	description?: string;
	unit: string;
	img?: string;
	category?: string;
	saveItem?: boolean;
}

export default Item;
