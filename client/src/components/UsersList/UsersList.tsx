import { Avatar, Typography, IconButton, Badge, styled, BadgeProps } from '@mui/material';
import './UsersList.css';
import { FiShare } from "react-icons/fi";
import { useTranslation } from 'react-i18next';
import User from '../../interface/UserInterface';
import { IoMdClose } from "react-icons/io";
import UserAvatar from '../UserAvatar/UserAvatar';
import { Fragment } from 'react';
import { GrPowerReset } from "react-icons/gr";


interface UsersListProps {
    users: User[];
    onDelete?: (id: string) => void;
    onClick?: (id: string) => void;
    onAdd?: () => void;
    onReset?: () => void;
    owner?: boolean;
}
function UsersList(props: UsersListProps) {
    
    const { t } = useTranslation('translation', { keyPrefix: 'UsersList' });

    const StyledBadge = styled(Badge)<BadgeProps>(({  }) => ({
        '& .MuiBadge-badge': {
          padding: 0,
      }
      }));

    const StyledBadgeButton = styled(Badge)<BadgeProps>(({  }) => ({
    '& .MuiBadge-badge': {
        padding: 0,
        top: '8px',
        right: '8px',
    }
    }));

  return (
    <div className='users-list'>
        <Typography variant='subtitle2' className='users-title' style={{ left: "1rem", right: '1rem'}} >{props.onAdd ? t("sharedWith") : t("usersInList")}</Typography>
        <div className={props.owner ? 'users' : 'users-no-delete'}>
            {props.users.map(user => {
                return (
                    <Fragment key={user._id}>
                        {props.owner ? <StyledBadge style={{margin: '10px'}} color='error' badgeContent={<span style={{cursor: 'pointer', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex'}} 
                        onClick={() => props.onDelete!(user._id)}><IoMdClose /></span>} >
                            {props.onClick ? <IconButton style={{padding: 0}} onClick={() => props.onClick!(user._id)} key={user._id}>
                            <UserAvatar user={user} />
                            </IconButton> : <UserAvatar user={user} key={user._id} />}
                        </StyledBadge> : props.onClick ? <IconButton style={{padding: 0}} onClick={() => props.onClick!(user._id)} key={user._id}>
                            <UserAvatar user={user} />
                            </IconButton> : <UserAvatar user={user} key={user._id} />}
                    </Fragment>
                )
            })}
            {props.onAdd && <StyledBadgeButton style={{margin: '10px'}} color='info' badgeContent={<span style={{cursor: 'pointer', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex'}} 
                        onClick={props.onReset}><GrPowerReset /></span>} >
                            <IconButton onClick={props.onAdd}>
                                <Avatar className='glass-button' sx={{ width: 50, height: 50 }}><FiShare size={"1.5rem"} color='black'/></Avatar>
                            </IconButton>
                        </StyledBadgeButton>}
        </div>
    </div>
  )
}

export default UsersList