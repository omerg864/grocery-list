import { Avatar, Typography, IconButton, Badge, styled, BadgeProps } from '@mui/material';
import './UsersList.css';
import { FiShare } from "react-icons/fi";
import { useTranslation } from 'react-i18next';
import User from '../../interface/UserInterface';
import { IoMdClose } from "react-icons/io";
import UserAvatar from '../UserAvatar/UserAvatar';
import { Fragment } from 'react';


interface UsersListProps {
    users: User[];
    onDelete?: (id: string) => void;
    onClick?: (id: string) => void;
    onAdd: () => void;
}
function UsersList(props: UsersListProps) {
    
    const { t } = useTranslation('translation', { keyPrefix: 'UsersList' });

    const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
        '& .MuiBadge-badge': {
          padding: 0
        },
      }));

  return (
    <div className='users-list'>
        <Typography variant='subtitle2' className='users-title' style={{ left: "1rem"}} >{t("sharedWith")}</Typography>
        <div className={props.onDelete ? 'users' : 'users-no-delete'}>
            {props.users.map(user => {
                return (
                    <Fragment key={user.id}>
                        {props.onDelete ? <StyledBadge style={{margin: '10px'}} color='error' badgeContent={<span style={{cursor: 'pointer', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex'}} 
                        onClick={() => props.onDelete!(user.id)}><IoMdClose /></span>} >
                            {props.onClick ? <IconButton style={{padding: 0}} onClick={() => props.onClick!(user.id)} key={user.id}>
                            <UserAvatar user={user} />
                            </IconButton> : <UserAvatar user={user} key={user.id} />}
                        </StyledBadge> : props.onClick ? <IconButton style={{padding: 0}} onClick={() => props.onClick!(user.id)} key={user.id}>
                            <UserAvatar user={user} />
                            </IconButton> : <UserAvatar user={user} key={user.id} />}
                    </Fragment>
                )
            })}
            <IconButton onClick={props.onAdd}>
                <Avatar className='glass-button' sx={{ width: 50, height: 50 }}><FiShare size={"1.5rem"} color='black'/></Avatar>
            </IconButton>
        </div>
    </div>
  )
}

export default UsersList