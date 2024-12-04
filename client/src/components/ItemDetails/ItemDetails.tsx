import Item, { ItemNew } from "../../interface/ItemInterface";
import { Fragment, SyntheticEvent } from "react";
import './ItemDetails.css';
import { Autocomplete, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, ThemeProvider, useTheme } from "@mui/material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useTranslation } from "react-i18next";
import Counter from '../Counter/Counter';
import formTheme from "../../themes/formTheme";
import { MdEdit } from "react-icons/md";
import { IoIosShare } from "react-icons/io";
import ListItem, { ListItemNew} from "../../interface/ListItemInterface";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";
import { motion } from "framer-motion";




interface ItemDetailsProps {
    item: Item | ListItem | ListItemNew | ItemNew;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    addCounter?: () => void;
    removeCounter?: () => void;
    onSelectionChange?: (e: SelectChangeEvent) => void;
    onImgIconClick?: () => void;
    img?: string | null;
    enableAmount?: boolean;
    amountEdit?: boolean;
    categories?: string[];
    onAutoCompleteChange?: (e: SyntheticEvent<Element, Event>, newValue: string | null) => void;
    onDefaultIconClick?: (id: string) => void;
    share?: boolean;
}

function ItemDetails(props: ItemDetailsProps) {

    const { t } = useTranslation('translation', { keyPrefix: 'ItemDetails' });

    const outerTheme = useTheme();
    const dimensions = useWindowDimensions();

    const units = ['pc', 'kg', 'g', 'l', 'ml', 'no', 'pk'];

    const showDefaultIcon = (props.disabled && !props.amountEdit && !props.share) ? true : false;

    const onImgClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        let image = e.target as HTMLImageElement;
        let imageCopy = image.cloneNode() as HTMLImageElement;
        if (dimensions.height > dimensions.width) {
            imageCopy.style.width = '100%';
            imageCopy.style.height = 'auto';
        } else {
            imageCopy.style.width = 'auto';
            imageCopy.style.height = '100%';
        }
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
        newDiv.style.zIndex = '9000';
        newDiv.appendChild(imageCopy);
        document.body.appendChild(newDiv);
        newDiv.addEventListener('click', () => {
            newDiv.remove();
        });
    }

  return (
    <Fragment>
        <div className="item-display-img-container">
            <motion.img animate={{scale: [0, 1]}} transition={{ delay: 0.8}}  onClick={onImgClick} className='item-display-img' src={props.img ? props.img : (props.item.img ? props.item.img : '/item.png')} alt={props.item.name} />
            {!props.share && <IconButton onClick={props.onImgIconClick} style={{
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
            </IconButton>}
            {showDefaultIcon && <IconButton onClick={() => props.onDefaultIconClick!((props.item as Item)._id)} style={{
                position: 'absolute',
                bottom: 'calc(50% - 1rem)',
                background: 'var(--color-primary)',
                left: '-1rem',
                width: '2rem',
                height: '2rem'
            }} aria-label="fingerprint" color="success">
                    { (props.item as Item).default ?  <MdOutlineStar size={"1.5rem"} color="black" /> :<MdOutlineStarBorder size={"1.5rem"} color="black" />}
            </IconButton>}
        </div>
            <div className="item-display-details">
                <TextareaAutosize minRows={2} placeholder={t('description')} name="description" value={props.item.description} onChange={props.onChange} disabled={props.disabled} />
                <ThemeProvider theme={formTheme(outerTheme)}>
                {props.categories ? <Autocomplete
                    freeSolo
                    color="success"
                    id="category"
                    disableClearable
                    options={props.categories}
                    value={props.item.category}
                    onChange={props.onAutoCompleteChange}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t('category')}
                        InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        }}
                        onChange={props.onChange}
                        value={props.item.category}
                        color="success"
                        name={"category"}
                    />
                    )}
                /> : 
                <TextField name="category" color='success' className='white-color-input' fullWidth value={props.item.category} InputLabelProps={{ disabled: props.disabled}} label={t('category')} onChange={props.onChange} disabled={props.disabled} variant="outlined" />}
                {props.amountEdit ? <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                {props.item.unit !== 'no' && ((props.item.unit === 'pc' || props.item.unit === 'pk') ? <Counter handleChange={props.onChange} addCounter={props.addCounter} removeCounter={props.removeCounter} count={(props.item as ListItem).amount!} disabled={props.disabled ? (props.enableAmount ? !props.enableAmount : props.disabled ) : false} />: 
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
                                    <MenuItem key={unit} value={unit}>{t(unit)}</MenuItem>
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
                                    <MenuItem key={unit} value={unit}>{t(unit)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>}
                </ThemeProvider>
        </div>
    </Fragment>
  )
}

export default ItemDetails