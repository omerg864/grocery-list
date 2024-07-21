import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import ListFormInterface from '../../interface/ListForm';
import './ListForm.css';
import { IoAddCircleSharp } from "react-icons/io5";
import { CiCircleMinus } from "react-icons/ci";
import { useTranslation } from 'react-i18next';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import FormTheme from '../../themes/formTheme';

interface ListFormProps {
    form: ListFormInterface;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChecked: (event: React.ChangeEvent<HTMLInputElement>) => void;
    formRef: React.RefObject<HTMLFormElement>;
    submit: (event: React.FormEvent<HTMLFormElement>) => void;
}
function ListForm(props: ListFormProps) {
  

    const { t } = useTranslation('translation', { keyPrefix: 'ListForm' });

    const labelPrev = { inputProps: { 'aria-label': t("previousListItems") } };
    const labelDefault = { inputProps: { 'aria-label': t("defaultListItems") } };  
    const outerTheme = useTheme();

  return (
    <form className='list-form' onSubmit={props.submit} ref={props.formRef} >
        <ThemeProvider theme={FormTheme(outerTheme)}>
            <TextField required name="title" color='success' className='white-color-input' fullWidth onChange={props.onChange} value={props.form.title} label={t('title')} variant="outlined" />
            <FormControlLabel control={<Checkbox name="prevItems" onChange={props.onChecked} checked={props.form.prevItems} {...labelPrev} color="success" icon={<CiCircleMinus color='white' />} checkedIcon={<IoAddCircleSharp />} />} label={t("previousListItems")} />
            <FormControlLabel control={<Checkbox name="defaultItems" onChange={props.onChecked} checked={props.form.defaultItems} {...labelDefault} color="success" icon={<CiCircleMinus color='white' />} checkedIcon={<IoAddCircleSharp />} />} label={t("defaultItems")} />
        </ThemeProvider>
    </form>
  )
}

export default ListForm