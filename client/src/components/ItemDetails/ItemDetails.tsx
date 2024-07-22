import Item from "../../interface/ItemInterface";
import { Fragment } from "react";
import './ItemDetails.css';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, ThemeProvider, useTheme } from "@mui/material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useTranslation } from "react-i18next";
import Autocomplete from '@mui/material/Autocomplete';
import Counter from '../Counter/Counter';
import formTheme from "../../themes/formTheme";



interface ItemDetailsProps {
    item: Item;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    addCounter?: () => void;
    removeCounter?: () => void;
    onSelectionChange?: (e: SelectChangeEvent) => void;
}
function ItemDetails(props: ItemDetailsProps) {

    const { t } = useTranslation('translation', { keyPrefix: 'ItemDetails' });

    const outerTheme = useTheme();

    const units = ['pc', 'kg', 'g', 'l', 'ml'];

  return (
    <Fragment>
        <img className='item-display-img' src={props.item.img ? props.item.img : '/item.png'} alt={props.item.name} />
            <div className="item-display-details">
                <TextareaAutosize placeholder={t('description')} name="description" value={props.item.description} onChange={props.onChange} disabled={props.disabled} />
                <ThemeProvider theme={formTheme(outerTheme)}>
                <TextField required name="category" color='success' className='white-color-input' fullWidth value={props.item.category} label={t('category')} onChange={props.onChange} disabled={props.disabled} variant="outlined" />
                {props.item.amount ? <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {props.item.unit === 'pc' ? <Counter handleChange={props.onChange} addCounter={props.addCounter} removeCounter={props.removeCounter} count={props.item.amount} disabled={props.disabled} />: 
                        <TextField required name="amount" onChange={props.onChange} color='success' type="number" className='white-color-input' fullWidth value={props.item.amount} label={t('amount')} disabled={props.disabled} variant="outlined" />}
                        <FormControl fullWidth>
                            <InputLabel color="success" id="unit-label">{t('unit')}</InputLabel>
                            <Select
                                labelId="unit-label"
                                id="unit"
                                disabled={props.disabled}
                                color="success"
                                value={props.item.unit}
                                label="Age"
                                onChange={props.onSelectionChange}
                            >
                                {units.map((unit) => (
                                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                </div>: <FormControl fullWidth>
                            <InputLabel color="success" id="unit-label">{t('unit')}</InputLabel>
                            <Select
                                labelId="unit-label"
                                id="unit"
                                disabled={props.disabled}
                                color="success"
                                value={props.item.unit}
                                label="Age"
                                onChange={props.onSelectionChange}
                            >
                                {units.map((unit) => (
                                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>}
                </ThemeProvider>
        </div>
    </Fragment>
  )
}

export default ItemDetails