import List from './ListInterface';

interface User {
	id: string;
	f_name: string;
    l_name: string;
    avatar: string;
	email?: string;
	password?: string;
	lists?:  string | List[];
}

export default User;
