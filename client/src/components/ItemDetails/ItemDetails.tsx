import Item from "../../interface/ItemInterface";
import { Fragment } from "react";
import './ItemDetails.css';
import { TextField, ThemeProvider, Typography, useTheme } from "@mui/material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useTranslation } from "react-i18next";
import Autocomplete from '@mui/material/Autocomplete';
import Counter from '../Counter/Counter';
import formTheme from "../../themes/formTheme";



interface ItemDetailsProps {
    item: Item;
}
function ItemDetails(props: ItemDetailsProps) {

    const { t } = useTranslation('translation', { keyPrefix: 'ItemDetails' });

    const outerTheme = useTheme();

  return (
    <Fragment>
        <img className='item-display-img' src={props.item.img ? props.item.img : '/item.png'} alt={props.item.name} />
            <div className="item-display-details">
                <TextareaAutosize placeholder={t('description')} value={props.item.description} disabled />
                <ThemeProvider theme={formTheme(outerTheme)}>
                <TextField required name="category" color='success' className='white-color-input' fullWidth value={props.item.category} label={t('category')} disabled variant="outlined" />
                {props.item.amount ? <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        disabled
                        options={['pc', 'kg', 'g', 'l', 'ml']}
                        value={props.item.unit}
                        sx={{ flex: 1 }}
                        renderInput={(params) => <TextField {...params} label={t('unit')} />}
                        />
                        {props.item.unit === 'pc' ? <Counter count={props.item.amount} disabled={true} />: 
                        <TextField required name="amount" color='success' type="number" className='white-color-input' fullWidth value={props.item.amount} label={t('amount')} disabled variant="outlined" />}
                </div>: <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        disabled
                        options={['pc', 'kg', 'g', 'l', 'ml']}
                        value={props.item.unit}
                        sx={{ flex: 1 }}
                        renderInput={(params) => <TextField {...params} label={t('unit')} />}
                        />}
                </ThemeProvider>
        </div>
    </Fragment>
  )
}

export default ItemDetails