import { ReactNode } from "react";

interface ListItem {
	_id: string;
	name: string;
	description?: string;
	amount?: number;
	unit: string;
	img?: string;
	category?: string;
	imageMemo?: ReactNode;
}

export interface ListItemNew {
	name: string;
	description?: string;
	amount?: number;
	unit: string;
	img?: string;
	category?: string;
	saveItem: boolean;
}

export default ListItem;
