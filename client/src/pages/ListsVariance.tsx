import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, useTheme } from '@mui/material';
import { MdOutlineAutoDelete } from "react-icons/md";
import { IoIosArchive } from "react-icons/io";
import listTheme from '../themes/listTheme';


const ListsVariance = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'Lists' });
    const navigate = useNavigate();
    
    const outerTheme = useTheme();

    const goToDeleted = () => {
        navigate('/lists/deleted');
    }

    const goToArchived = () => {
        navigate('/lists/archived');
    }

    const back = () => {
      navigate('/');
  }

    const pages = [
        {title: t('deleted'), goTo: goToDeleted, icon: <MdOutlineAutoDelete />},
        {title: t('archived'), goTo: goToArchived, icon: <IoIosArchive />}
    ]

    
  return (
    <main>
        <Header title={t("variance")} onBack={back} />
        <ThemeProvider theme={listTheme(outerTheme)}>
        {pages.map((page, index) => (
              <ListItem disablePadding key={index} onClick={page.goTo}>
                <ListItemButton>
                  <ListItemIcon>
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText primary={page.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </ThemeProvider>
    </main>
  )
}

export default ListsVariance;