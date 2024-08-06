import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import ListFormInterface from '../../interface/ListForm';
import './ListForm.css';
import { IoAddCircleSharp } from "react-icons/io5";
import { CiCircleMinus } from "react-icons/ci";
import { useTranslation } from 'react-i18next';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import FormTheme from '../../themes/formTheme';
import Lists from '../../interface/ListsInterface';
import { formatDate } from '../../utils/functions';
import { motion } from 'framer-motion';

interface ListFormProps {
    form: ListFormInterface;
    lists: Lists[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChecked: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectionChange?: (e: SelectChangeEvent) => void;
    formRef: React.RefObject<HTMLFormElement>;
    submit: (event: React.FormEvent<HTMLFormElement>) => void;
}
function ListForm(props: ListFormProps) {
  

    const { t } = useTranslation('translation', { keyPrefix: 'ListForm' });

    const labelDefault = { inputProps: { 'aria-label': t("defaultListItems") } };  
    const outerTheme = useTheme();

  return (
    <motion.form initial={{ opacity: 0}} animate={{ opacity: 1 }}
    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className='list-form' onSubmit={props.submit} ref={props.formRef} >
        <ThemeProvider theme={FormTheme(outerTheme)}>
            <TextField required name="title" color='success' className='white-color-input' fullWidth onChange={props.onChange} value={props.form.title} label={t('title')} variant="outlined" />
            <FormControl fullWidth>
              <InputLabel color="success" id="previous-label">{t('previousListItems')}</InputLabel>
              <Select
                  labelId="previous-label"
                  id="previous"
                  color="success"
                  value={props.form.prevListItems}
                  label={t('prevListItems')}
                  onChange={props.onSelectionChange}
              >
                  {props.lists.map((list) => (
                      <MenuItem key={list._id} value={list._id}><div style={{display: 'flex', gap: '5px'}}>
                        <Typography>{list.title}</Typography>
                        <div style={{display: 'flex', alignItems: 'end'}}>
                          <small>({formatDate(list.updatedAt)})</small>
                        </div>
                        </div></MenuItem>
                  ))}
                  <MenuItem value={""}>{t('none')}</MenuItem>
              </Select>
            </FormControl>
            <small>{t('prevListItemExplanation')}</small>
            <FormControlLabel control={<Checkbox name="defaultItems" onChange={props.onChecked} checked={props.form.defaultItems} {...labelDefault} color="success" icon={<CiCircleMinus size={'1.5rem'} color='white' />} checkedIcon={<IoAddCircleSharp size={'1.5rem'} />} />} label={t("defaultItems")} /> 
        </ThemeProvider>
    </motion.form>
  )
}

export default ListForm