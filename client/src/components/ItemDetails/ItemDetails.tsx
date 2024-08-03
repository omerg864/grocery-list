import Item, { ItemNew } from "../../interface/ItemInterface";
import { Fragment } from "react";
import './ItemDetails.css';
import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, ThemeProvider, useTheme } from "@mui/material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useTranslation } from "react-i18next";
import Counter from '../Counter/Counter';
import formTheme from "../../themes/formTheme";
import { MdEdit } from "react-icons/md";
import { IoIosShare } from "react-icons/io";
import ListItem, { ListItemNew} from "../../interface/ListItemInterface";




interface ItemDetailsProps {
    item: Item | ListItem | ListItemNew | ItemNew;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    addCounter?: () => void;
    removeCounter?: () => void;
    onSelectionChange?: (e: SelectChangeEvent) => void;
    onImgIconClick: () => void;
    img?: string | null;
    enableAmount?: boolean;
    amountEdit?: boolean;
}

function ItemDetails(props: ItemDetailsProps) {

    const { t } = useTranslation('translation', { keyPrefix: 'ItemDetails' });

    const outerTheme = useTheme();

    const units = ['pc', 'kg', 'g', 'l', 'ml', ''];

    const onImgClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        let image = e.target as HTMLImageElement;
        let imageCopy = image.cloneNode() as HTMLImageElement;
        imageCopy.style.width = '100%';
        imageCopy.style.height = 'auto';
        imageCopy.style.borderRadius = '0';
        let newDiv = document.createElement('div');
        newDiv.style.position = 'fixed';
        newDiv.style.top = '0';
        newDiv.style.left = '0';
        newDiv.style.width = '100%';
        newDiv.style.height = '100%';
        newDiv.style.background = 'rgba(0, 0, 0, 0.8)';
        newDiv.style.display = 'flex';
        newDiv.style.alignItems = 'center';
        newDiv.style.justifyContent = 'center';
        newDiv.appendChild(imageCopy);
        document.body.appendChild(newDiv);
        newDiv.addEventListener('click', () => {
            newDiv.remove();
        });
    }

  return (
    <Fragment>
        <div className="item-display-img-container">
            <img onClick={onImgClick} className='item-display-img' src={props.img ? props.img : (props.item.img ? props.item.img : '/item.png')} alt={props.item.name} />
            <IconButton onClick={props.onImgIconClick} style={{
                position: 'absolute',
                bottom: 'calc(50% - 1rem)',
                background: 'var(--color-primary)',
                right: '-1rem',
                width: '2rem',
                height: '2rem'
            }} aria-label="fingerprint" color="success">
                {props.disabled ? <Fragment>
                    <IoIosShare color="black" />
                </Fragment> : <Fragment>
                    <MdEdit color="black" />
                </Fragment>}
            </IconButton>
        </div>
            <div className="item-display-details">
                <TextareaAutosize placeholder={t('description')} name="description" value={props.item.description} onChange={props.onChange} disabled={props.disabled} />
                <ThemeProvider theme={formTheme(outerTheme)}>
                <TextField name="category" color='success' className='white-color-input' fullWidth value={props.item.category} InputLabelProps={{ disabled: props.disabled}} label={t('category')} onChange={props.onChange} disabled={props.disabled} variant="outlined" />
                {props.amountEdit ? <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                {props.item.unit !== '' && (props.item.unit === 'pc' ? <Counter handleChange={props.onChange} addCounter={props.addCounter} removeCounter={props.removeCounter} count={(props.item as ListItem).amount!} disabled={props.disabled ? (props.enableAmount ? !props.enableAmount : props.disabled ) : false} />: 
                        <TextField required name="amount" onChange={props.onChange} color='success' type="number" className='white-color-input' fullWidth value={(props.item as ListItem).amount} label={t('amount')} disabled={props.disabled ? (props.enableAmount ? !props.enableAmount : props.disabled ) : false}  variant="outlined" />)}
                        <FormControl fullWidth>
                            <InputLabel disabled={props.disabled ? (props.enableAmount ? !props.enableAmount : props.disabled) : false} color="success" id="unit-label">{t('unit')}</InputLabel>
                            <Select
                                labelId="unit-label"
                                id="unit"
                                disabled={props.disabled ? (props.enableAmount ? !props.enableAmount : props.disabled) : false}
                                color="success"
                                value={props.item.unit}
                                label={t('unit')}
                                onChange={props.onSelectionChange}
                            >
                                {units.map((unit) => (
                                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                </div>: <FormControl fullWidth>
                            <InputLabel disabled={props.disabled} color="success" id="unit-label">{t('unit')}</InputLabel>
                            <Select
                                labelId="unit-label"
                                id="unit"
                                disabled={props.disabled}
                                color="success"
                                value={props.item.unit}
                                label={t('unit')}
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