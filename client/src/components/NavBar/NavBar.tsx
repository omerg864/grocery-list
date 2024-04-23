import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import './NavBar.css';
import { IoMdNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  selectedTab: number;
  setSelectedTab: (newValue: number) => void;
}

function NavBar(props: NavBarProps) {

    const navigate = useNavigate();

    const changeTab = (_e: React.SyntheticEvent, newValue: number) => {
        // TODO: navigate to the correct page
        navigate(`/lists/32ufwoeubf`);
        props.setSelectedTab(newValue);
    }

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
    value={props.selectedTab}
    onChange={changeTab}
    >
    <BottomNavigationAction sx={{color: props.selectedTab === 0 ? 'var(--color-primary) !important' : ''}} label="Lists" icon={<FaListUl />} />
    <BottomNavigationAction sx={{color: props.selectedTab === 1 ? 'var(--color-primary) !important' : ''}} label="Items" icon={<MdFastfood />} />
    <BottomNavigationAction sx={{color: props.selectedTab === 2 ? 'var(--color-primary) !important' : ''}} label="Notifications" icon={<IoMdNotifications />} />
    <BottomNavigationAction sx={{color: props.selectedTab === 3 ? 'var(--color-primary) !important' : ''}} label="Profile" icon={<FaUserCircle />} />
    </BottomNavigation>
</Paper>
  )
}

export default NavBar