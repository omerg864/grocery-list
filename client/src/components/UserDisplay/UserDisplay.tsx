import { Avatar, Button, Icon, IconButton, Typography } from '@mui/material';
import './UserDisplay.css';
import User from '../../interface/UserInterface';
import UserAvatar from '../UserAvatar/UserAvatar';

interface UserDisplayProps {
    user: User;
    onClick?: (user: User) => void;
}

function UserDisplay(props: UserDisplayProps) {
  return (
    <Button style={{display: 'flex', gap: '10px'}} onClick={() => props.onClick!(props.user)}>
            <UserAvatar user={props.user} />
            <div className='user-details'>
                <Typography variant='h6'>{props.user.f_name + ' ' + props.user.l_name}</Typography>
            </div>
    </Button>
  )
}

export default UserDisplay