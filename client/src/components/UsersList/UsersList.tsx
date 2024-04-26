import { Avatar, Typography, IconButton, Badge } from '@mui/material';
import './UsersList.css';
import { IoMdAdd } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import User from '../../interface/UserInterface';
import React from 'react';


interface UsersListProps {
    users: User[];
    onDelete?: (id: string) => void;
    onClick?: (id: string) => void;
    onAdd: () => void;
}
function UsersList(props: UsersListProps) {
    
    const { t } = useTranslation('translation', { keyPrefix: 'UsersList' });

  return (
    <div className='users-list'>
        <Typography variant='subtitle2' className='users-title' style={{ left: "1rem"}} >{t("sharedWith")}</Typography>
        <div className='users'>
            {props.users.map(user => {
                return (
                    <IconButton onClick={() => props.onClick!(user.id)} key={user.id}>
                        {user.avatar ? <Avatar sx={{ width: 50, height: 50 }} src={user.avatar} /> :
                        <Avatar sx={{ width: 50, height: 50 }}>{user.f_name[0] + user.l_name[0]}</Avatar>}
                    </IconButton>
                )
            })}
            <IconButton onClick={props.onAdd}>
                <Avatar className='glass-button' sx={{ width: 50, height: 50 }}><IoMdAdd size={"1.5rem"} color='black'/></Avatar>
            </IconButton>
        </div>
    </div>
  )
}

export default UsersList