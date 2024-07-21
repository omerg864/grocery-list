import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { VscRequestChanges } from "react-icons/vsc";
import NotificationMessage from '../interface/NotificationInterface';
import { CiCircleInfo } from "react-icons/ci";

function Notifications() {

  const { t } = useTranslation('translation', { keyPrefix: 'Notifications' });

  const [notifications, setNotifications] = useState<NotificationMessage[]>([
    {
      title: 'name of the list',
      type: 'change',
      message: 'Hadar has changed the list',
      createdAt: new Date().toISOString(),
      read: false,
      id: '1'
    },
    {
      title: 'name of the list',
      type: 'change',
      message: 'Hadar has changed the list',
      createdAt: new Date().toISOString(),
      read: false,
      id: '2'
    }
  ]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'change':
        return <VscRequestChanges size={"1.5rem"} color='white' />
      default:
        return <CiCircleInfo size={"1.5rem"} color='white' />
    }
  }

  return (
    <main>
      <Header title={t('notifications')} />
      <div className='list-form'>
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification.id} disablePadding>
              <ListItemIcon>
                {getIcon(notification.type)}
              </ListItemIcon>
              <ListItemText primary={notification.title} secondary={<span style={{color: 'white'}}>{notification.message}</span>} />
            </ListItem>
          ))}
        </List>
      </div>
    </main>
  )
}

export default Notifications