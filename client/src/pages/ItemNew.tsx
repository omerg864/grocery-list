import Item from "../interface/ItemInterface";
import Header from "../components/Header/Header";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Checkbox, FormControlLabel, SelectChangeEvent, TextField, ThemeProvider, useTheme } from "@mui/material";
import ItemDetails from "../components/ItemDetails/ItemDetails";
import GlassButton from "../components/GlassButton/GlassButton";
import Loading from "../components/Loading/Loading";
import { useTranslation } from "react-i18next";
import { IoMdAdd } from "react-icons/io";
import formTheme from "../themes/formTheme";
import { IoAddCircleSharp } from "react-icons/io5";
import { CiCircleMinus } from "react-icons/ci";



function ItemNew() {

  const { id } = useParams<{ id: string, item: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'ItemNew' });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let defaultItem: Omit<Item, 'id'> & {saveItem?: boolean};
  if (id) {
    defaultItem = {name: '', category: "", img: "/item.png", description: "", unit: "pc", amount: 1};
  } else {
    defaultItem = {name: '', category: "", img: "/item.png", description: "", unit: "pc", saveItem: true};
  }
  const [itemState, setItemState] = useState<Omit<Item, 'id'> & {saveItem?: boolean}>(defaultItem);
  const [img, setImg] = useState<string | null>(null);

  const outerTheme = useTheme();


  let back: any = {};

  if (id) {
    back = {
      onBack: () => navigate(`/lists/${id}`)
    }
  } else {
    back = {
      onBack: () => navigate(`/items`)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setItemState(prev => ({...prev, [name]: value}));
  }

  const onChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setItemState(prev => ({...prev, [name]: checked}));
  }

  const onSelectionChange = (e: SelectChangeEvent) => {
    const value = e.target.value as string;
    setItemState(prev => ({...prev, unit: value}));
  }

  const addCounter = () => {
    setItemState(prev => ({...prev, amount: prev.amount! + 1}));
  }

  const removeCounter = () => {
    setItemState(prev => ({...prev, amount: prev.amount! - 1}));
  }

  const createItem = async () => {
    setIsLoading(true);
    try {
        // await updateItem(itemState);
        setIsLoading(false);
        (back.onBack as Function)();
    } catch (error) {
      setIsLoading(false);
    }
  }

  const onImgIconClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setImg(URL.createObjectURL(files[0]));
      }
    }
  }

  const label = { inputProps: { 'aria-label': t("saveItem") } };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
        <Header title={t('newItem')} {...back} />
        <form className="list-form" style={{position: 'relative', paddingTop: '5.5rem'}} onSubmit={createItem}>
          <ThemeProvider theme={formTheme(outerTheme)}>
            <TextField required name="name" color='success' className='white-color-input' fullWidth value={itemState.name} label={t('name')} onChange={onChange} variant="outlined" />
          </ThemeProvider>
          <ItemDetails onImgIconClick={onImgIconClick} img={img} onSelectionChange={onSelectionChange} onChange={onChange} addCounter={addCounter} removeCounter={removeCounter} item={itemState} />
          {!id && <FormControlLabel control={<Checkbox name="saveItem" onChange={onChecked} checked={itemState.saveItem} {...label} color="success" icon={<CiCircleMinus size={'1.5rem'} color='white' />} checkedIcon={<IoAddCircleSharp size={'1.5rem'} />} />} label={t("saveItem")} />}
          <GlassButton endIcon={<IoMdAdd size={"1.5rem"} color='white'/>} text={t('create')} style={{width: "100%", color: "white"}} type="submit"/>
        </form>
    </main>
  )
}

export default ItemNew