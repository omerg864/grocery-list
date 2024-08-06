import { Fragment, useState } from "react";
import Item from "../../interface/ItemInterface.ts";
import ItemView from "../ItemView/ItemView.tsx";
import './ItemsList.css';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import Counter from "../Counter/Counter.tsx";
import { useTranslation } from "react-i18next";
import ListItem from "../../interface/ListItemInterface.ts";


interface ItemsListProps {
    items: Item[] | ListItem[];
    onSwipeRight?: (id: string) => void;
    onSwipeLeft?: (id: string) => void;
    onItemClicked?: (id: string) => void;
    onAmountChanged?: (id: string, amount: string) => void;
    onSelectionChange?: (e: SelectChangeEvent, id: string) => void;
    amounts?: {id: string, amount: number | string}[];
    addCounter?: (id: string) => void;
    removeCounter?: (id: string) => void;
    rightIcon?: React.ReactNode;
    leftIcon?: React.ReactNode;
}

function ItemsList(props: ItemsListProps) {

    const [open, setOpen] = useState<string | null>(null);

    const { t } = useTranslation('translation', { keyPrefix: 'ItemsList' });
    const genericT = useTranslation('translation', { keyPrefix: 'Generic' }).t;

    const units = ['pc', 'kg', 'g', 'l', 'ml', ''];


  return (
    <div className="items-list">
        {props.items.length === 0 ? <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}> 
        <img alt="No bundles" style={{width: '60%'}} src="/shopping-cart-icon.png" />
        <Typography variant="h5">{genericT('noItems')}</Typography>
        </div> : props.items.map((item: Item | ListItem) => (
          <Fragment key={item._id} >
          <ItemView rightIcon={props.rightIcon} leftIcon={props.leftIcon} onItemClicked={props.onItemClicked} open={open} setOpen={setOpen} item={item} onSwipeRight={props.onSwipeRight} onSwipeLeft={props.onSwipeLeft}/>
          {props.amounts && <div style={{display: 'flex', gap: '10px', alignItems: 'center', padding: '0.5rem 0'}}>
            {item.unit && (item.unit === 'pc' ? <Counter handleChange={(e) => props.onAmountChanged!(item._id, e.target.value)} addCounter={() => props.addCounter!(item._id)} removeCounter={() => props.removeCounter!(item._id)} count={props.amounts?.find(obj => obj.id === item._id)!.amount!} />: 
                        <TextField required name="amount" onChange={(e) => props.onAmountChanged!(item._id, e.target.value)} color='success' type="number" className='white-color-input' fullWidth value={props.amounts?.find(obj => obj.id === item._id)!.amount!} label={t('amount')} variant="outlined" />)}
            <FormControl fullWidth>
                <InputLabel color="success" id="unit-label">{t('unit')}</InputLabel>
                <Select
                    labelId="unit-label"
                    id="unit"
                    color="success"
                    onChange={(e) => props.onSelectionChange!(e, item._id)}
                    value={item.unit}
                    label={t('unit')}
                >
                    {units.map((unit) => (
                        <MenuItem key={unit} value={unit}>{t(unit)}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            </div>}
          </Fragment>
        ))}
    </div>
  )
}

export default ItemsList