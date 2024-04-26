import User from './UserInterface';

interface ListForm {
	title: string;
	prevItems: boolean;
	defaultItems: boolean;
	users: User[];
}

export default ListForm;
