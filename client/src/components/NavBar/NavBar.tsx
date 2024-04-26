import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import './NavBar.css';
import { IoMdNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NavBarProps {
  selectedTab: number;
  setSelectedTab: (newValue: number) => void;
}

function NavBar(props: NavBarProps) {

    const navigate = useNavigate();
    const { t } = useTranslation('translation', { keyPrefix: 'NavBar' });

    const changeTab = (_e: React.SyntheticEvent, newValue: number) => {
        // TODO: navigate to the correct page
        props.setSelectedTab(newValue);
        switch(newValue){
            case 0:
                navigate('/');
                break;
            case 1:
                navigate('/items');
                break;
            case 2:
                navigate('/notifications');
                break;
            case 3:
                navigate('/profile');
                break;
            default:
                navigate('/');
                break;
        }
    }

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99 }} elevation={3}>
        <BottomNavigation
    value={props.selectedTab}
    onChange={changeTab}
    >
    <BottomNavigationAction sx={{color: props.selectedTab === 0 ? 'var(--color-primary) !important' : ''}} label={t("lists")} icon={<FaListUl size={"1.2rem"}/>} />
    <BottomNavigationAction sx={{color: props.selectedTab === 1 ? 'var(--color-primary) !important' : ''}} label={t("items")} icon={<MdFastfood size={"1.2rem"}/>} />
    <BottomNavigationAction sx={{color: props.selectedTab === 2 ? 'var(--color-primary) !important' : ''}} label={t("notifications")} icon={<IoMdNotifications size={"1.2rem"} />} />
    <BottomNavigationAction sx={{color: props.selectedTab === 3 ? 'var(--color-primary) !important' : ''}} label={t("profile")} icon={<FaUserCircle size={"1.2rem"} />} />
    </BottomNavigation>
</Paper>
  )
}

export default NavBar