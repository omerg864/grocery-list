import { Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Paper, Slide, TextField } from '@mui/material';
import ListFormInterface from '../../interface/ListForm';
import './ListForm.css';
import { forwardRef, useEffect, useState } from 'react';
import { IoAddCircleSharp } from "react-icons/io5";
import { CiCircleMinus } from "react-icons/ci";
import { useTranslation } from 'react-i18next';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import UsersList from '../UsersList/UsersList';
import { TransitionProps } from '@mui/material/transitions';
import User from '../../interface/UserInterface';
import UserDisplay from '../UserDisplay/UserDisplay';


const customTheme = (outerTheme: Theme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              '--TextField-brandBorderColor': 'white',
              '--TextField-color': 'white',
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: 'var(--TextField-brandBorderColor)',
            },
            input: {
              color: 'var(--TextField-color)',
            },
          },
        },
      },
    });

interface ListFormProps {
    form: ListFormInterface;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChecked: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteUser: (id: string) => void;
    onAddUser: (user: User) => void;
}
function ListForm(props: ListFormProps) {
  

    const { t } = useTranslation('translation', { keyPrefix: 'ListForm' });

    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [results, setResults] = useState<User[]>([{id: "2", f_name: 'Omer', l_name: "Gai", avatar: ""}]);

    const labelPrev = { inputProps: { 'aria-label': t("previousListItems") } };
    const labelDefault = { inputProps: { 'aria-label': t("defaultListItems") } };  
    const outerTheme = useTheme();

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const searchUsers = async () => {
      // add props.form.users to exclude them from the search
    }

    useEffect(() => {
      if (!open) {
        setSearch('');
      }
    }, [open]);

    useEffect(() => {
      if (search.length > 2) {
        searchUsers();
      }
    }, [search]);

    const addUser = (user: User) => {
      props.onAddUser(user);
      setOpen(false);
    }

  return (
    <form className='list-form' >
        <Dialog
              open={open}
              keepMounted
              maxWidth='lg'
              fullWidth={true}
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{t('addUsers')}</DialogTitle>
              <DialogContent style={{paddingTop: '20px'}}>
                <TextField name="search" color='success' fullWidth onChange={(e) => setSearch(e.target.value)} value={search} label={t('search')} variant="outlined" />
                  <div className='users-display'>
                    {results.map((user: User) => (
                      <UserDisplay key={user.id} user={user} onClick={addUser} />))}
                  </div>
              </DialogContent>
        </Dialog>
        <ThemeProvider theme={customTheme(outerTheme)}>
            <TextField name="title" color='success' className='white-color-input' fullWidth onChange={props.onChange} value={props.form.title} label={t('title')} variant="outlined" />
            <UsersList onAdd={handleClickOpen} onDelete={props.onDeleteUser} users={props.form.users} />
            <FormControlLabel control={<Checkbox name="prevItems" onChange={props.onChecked} checked={props.form.prevItems} {...labelPrev} color="success" icon={<CiCircleMinus color='white' />} checkedIcon={<IoAddCircleSharp />} />} label={t("previousListItems")} />
            <FormControlLabel control={<Checkbox name="defaultItems" onChange={props.onChecked} checked={props.form.defaultItems} {...labelDefault} color="success" icon={<CiCircleMinus color='white' />} checkedIcon={<IoAddCircleSharp />} />} label={t("defaultItems")} />
        </ThemeProvider>
    </form>
  )
}

export default ListForm