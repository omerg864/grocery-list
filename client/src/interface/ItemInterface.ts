import { ReactNode } from "react";

interface Item {
	_id: string;
	name: string;
	description?: string;
	unit: string;
	img?: string;
	category?: string;
	imageMemo?: ReactNode;
	stateUpdated?: Date;
	default: boolean | null;
}


export interface ItemNew {
	name: string;
	description?: string;
	unit: string;
	img?: string;
	category?: string;
	saveItem?: boolean;
}

export default Item;
