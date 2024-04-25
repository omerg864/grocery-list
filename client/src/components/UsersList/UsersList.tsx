import { Avatar, Typography, IconButton } from '@mui/material';
import './UsersList.css';
import { IoMdAdd } from "react-icons/io";
import { useTranslation } from 'react-i18next';


interface UsersListProps {
    users: {id: string, f_name: string, l_name: string, avatar: string}[];
}
function UsersList(props: UsersListProps) {
    
    const { t } = useTranslation('translation', { keyPrefix: 'UsersList' });

  return (
    <div className='users-list'>
        <Typography variant='subtitle2' className='users-title' >{t("sharedWith")}</Typography>
        <div className='users'>
            {props.users.map(user => {
                return (
                    <IconButton key={user.id}>
                        {user.avatar ? <Avatar sx={{ width: 50, height: 50 }} src={user.avatar} /> :
                     <Avatar sx={{ width: 50, height: 50 }}>{user.f_name[0] + user.l_name[0]}</Avatar>}
                     </IconButton>
                )
            })}
            <IconButton>
                <Avatar className='glass-button' sx={{ width: 50, height: 50 }}><IoMdAdd size={"1.5rem"} color='black'/></Avatar>
            </IconButton>
        </div>
    </div>
  )
}

export default UsersList