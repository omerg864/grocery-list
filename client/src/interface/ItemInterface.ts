import { ReactNode } from "react";

interface Item {
	_id: string;
	name: string;
	description?: string;
	amount?: number;
	unit: string;
	img?: string;
	category?: string;
	imageMemo?: ReactNode;
}

export default Item;
