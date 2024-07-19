import React from 'react'
import User from '../../interface/UserInterface';
import { Avatar } from '@mui/material';


interface UserAvatarProps {
    user: User;
}
function UserAvatar(props: UserAvatarProps) {
  return (
    <React.Fragment>
    {props.user.avatar ? <Avatar sx={{ width: 50, height: 50 }} src={props.user.avatar} /> :
                        <Avatar sx={{ width: 50, height: 50 }}>{props.user.f_name[0] + props.user.l_name[0]}</Avatar>}
    </React.Fragment>
  )
}

export default UserAvatar