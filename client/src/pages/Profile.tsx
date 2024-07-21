import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useState } from 'react';
import { Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, ThemeProvider, useTheme } from '@mui/material';
import { CgProfile } from "react-icons/cg";
import { RiLockPasswordLine } from "react-icons/ri";
import { GiSettingsKnobs } from "react-icons/gi";
import listTheme from '../themes/listTheme';
import PersonalDetails from '../components/PersonalDetails/PersonalDetails';
import PasswordChange from '../components/PasswordChange/PasswordChange';
import Preferences from '../components/Preferences/Preferences';
import Loading from '../components/Loading/Loading';


function Profile() {

  const { t } = useTranslation('translation', { keyPrefix: 'Profile' });
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const outerTheme = useTheme();

  const logout = () => {
    // TODO: logout
  }

  const title = () => {
    switch(tab) {
      case 1:
        return t('personalDetails');
      case 2:
        return t('password');
      case 3:
        return t('preferences');
      default:
        return t('profile');
    }
  }

  const backClick = () => {
    setTab(0);
  }

  let back = {};
  if(tab !== 0) {
    back = {onBack: backClick};
  }

  const tabs = [{title: t('personalDetails'), icon: <CgProfile color='white'/>}, {title: t('password'), icon: <RiLockPasswordLine color='white'/>}, {title: t('preferences'), icon: <GiSettingsKnobs color='white'/>}];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
    <Header title={title()} {...back} buttonTitle={t('logout')} buttonClick={logout}  />
    <div className='list-form' >
      <ThemeProvider theme={listTheme(outerTheme)}>
      {tab === 0 && <List>
            {tabs.map((tab, index) => (
              <ListItem disablePadding key={index} onClick={() => setTab(index + 1)}>
                <ListItemButton>
                  <ListItemIcon>
                    {tab.icon}
                  </ListItemIcon>
                  <ListItemText primary={tab.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>}
        {tab === 1 && <PersonalDetails setTab={setTab} setIsLoading={setIsLoading} />}
        {tab === 2 && <PasswordChange setTab={setTab} setIsLoading={setIsLoading} />}
        {tab === 3 && <Preferences setTab={setTab} setIsLoading={setIsLoading} />}
      </ThemeProvider>
  </div>
  </main>
  )
}

export default Profile