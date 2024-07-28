import { Fragment, useState } from "react";
import Item from "../../interface/ItemInterface.ts";
import ItemView from "../ItemView/ItemView.tsx";
import './ItemsList.css';
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Counter from "../Counter/Counter.tsx";
import { useTranslation } from "react-i18next";


interface ItemsListProps {
    items: Item[];
    onSwipeRight?: (id: string) => void;
    onSwipeLeft?: (id: string) => void;
    onItemClicked?: (id: string) => void;
    onAmountChanged?: (id: string, amount: string) => void;
    amounts?: {id: string, amount: number | ""}[];
    addCounter?: (id: string) => void;
    removeCounter?: (id: string) => void;
    rightIcon?: React.ReactNode;
    leftIcon?: React.ReactNode;
}

function ItemsList(props: ItemsListProps) {

    const [open, setOpen] = useState<string | null>(null);

    const { t } = useTranslation('translation', { keyPrefix: 'ItemsList' });

    const units = ['pc', 'kg', 'g', 'l', 'ml'];


  return (
    <div className="items-list">
        {props.items.map((item: Item) => (
          <Fragment key={item.id} >
          <ItemView rightIcon={props.rightIcon} leftIcon={props.leftIcon} onItemClicked={props.onItemClicked} open={open} setOpen={setOpen} item={item} onSwipeRight={props.onSwipeRight} onSwipeLeft={props.onSwipeLeft}/>
          {props.amounts && <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            {item.unit === 'pc' ? <Counter handleChange={(e) => props.onAmountChanged!(item.id, e.target.value)} addCounter={() => props.addCounter!(item.id)} removeCounter={() => props.removeCounter!(item.id)} count={props.amounts?.find(obj => obj.id === item.id)!.amount!} />: 
                        <TextField required name="amount" onChange={(e) => props.onAmountChanged!(item.id, e.target.value)} color='success' type="number" className='white-color-input' fullWidth value={props.amounts?.find(obj => obj.id === item.id)!.amount!} label={t('amount')} variant="outlined" />}
            <FormControl fullWidth>
                <InputLabel disabled={true} color="success" id="unit-label">{t('unit')}</InputLabel>
                <Select
                    labelId="unit-label"
                    id="unit"
                    disabled={true}
                    color="success"
                    value={item.unit}
                    label={t('unit')}
                >
                    {units.map((unit) => (
                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
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