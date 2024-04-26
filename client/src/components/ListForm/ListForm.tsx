import { Card, Checkbox, FormControlLabel, Paper, TextField } from '@mui/material';
import ListFormInterface from '../../interface/ListForm';
import './ListForm.css';
import { TbPlayerTrackPrev } from 'react-icons/tb';
import { TbPlayerTrackPrevFilled } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import UsersList from '../UsersList/UsersList';


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
}
function ListForm(props: ListFormProps) {

    const { t } = useTranslation('translation', { keyPrefix: 'ListForm' });

    const labelPrev = { inputProps: { 'aria-label': t("previousListItems") } };
    const labelDefault = { inputProps: { 'aria-label': t("defaultListItems") } };
      
        const outerTheme = useTheme();

  return (
    <form className='list-form' >
        <ThemeProvider theme={customTheme(outerTheme)}>
            <TextField name="title" color='success' className='white-color-input' fullWidth onChange={props.onChange} value={props.form.title} label={t('title')} variant="outlined" />
            <UsersList users={props.form.users} />
            <FormControlLabel control={<Checkbox name="prevItems" onChange={props.onChecked} checked={props.form.prevItems} {...labelPrev} color="success" icon={<TbPlayerTrackPrev color='white' />} checkedIcon={<TbPlayerTrackPrevFilled />} />} label={t("previousListItems")} />
            <FormControlLabel control={<Checkbox name="defaultItems" onChange={props.onChecked} checked={props.form.defaultItems} {...labelDefault} color="success" icon={<TbPlayerTrackPrev color='white' />} checkedIcon={<TbPlayerTrackPrevFilled />} />} label={t("previousListItems")} />
        </ThemeProvider>
    </form>
  )
}

export default ListForm