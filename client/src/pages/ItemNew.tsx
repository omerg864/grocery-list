import Item, { ItemNew as ItemNewInterface } from "../interface/ItemInterface";
import Header from "../components/Header/Header";
import { FormEvent, SyntheticEvent, useEffect, useState } from "react";
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
import { get, post } from "../utils/apiRequest";
import Cookies from "universal-cookie";
import { ListItemNew } from "../interface/ListItemInterface";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import Lists from "../interface/ListsInterface";
import { itemsDataAtom, listsState } from "../recoil/atoms";
import { getMinutesBetweenDates } from "../utils/functions";
import MemoizedImage from "../components/MemoizedImage/MemoizedImage";



function ItemNew() {

  const { id } = useParams<{ id: string, item: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'ItemNew' });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let defaultItem: ItemNewInterface | ListItemNew;
  if (id) {
    defaultItem = {name: '', category: "", img: "/item.png", description: "", unit: "pc", amount: 1, saveItem: true};
  } else {
    defaultItem = {name: '', category: "", img: "/item.png", description: "", unit: "pc"};
  }
  const [itemState, setItemState] = useState<ItemNewInterface | ListItemNew>(defaultItem);
  const [lists, setLists] = useRecoilState<Lists[]>(listsState);
  const [items, setItems] = useRecoilState(itemsDataAtom);
  const [categories, setCategories] = useState<string[]>(items.categories);
  const [img, setImg] = useState<File | null>(null);
  const cookies = new Cookies();

  const outerTheme = useTheme();


  let back: any = {};
  let api_url = '/api/item';

  if (id) {
    back = {
      onBack: () => navigate(`/lists/${id}/select`)
    }
    api_url = `/api/list/${id}/item`;
  } else {
    back = {
      onBack: () => navigate(`/items`)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setItemState(prev => ({...prev, [name]: value}));
  }

  const onAutoCompleteChange = (_: SyntheticEvent<Element, Event>, newVal: string | null) => {
    setItemState(prev => ({...prev, category: newVal ? newVal : ""}));
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
    setItemState(prev => ({...prev, amount: (prev as ListItemNew).amount! + 1}));
  }

  const removeCounter = () => {
    setItemState(prev => ({...prev, amount: (prev as ListItemNew).amount! - 1}));
  }

  const createItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!itemState.name) {
      toast.error(t('nameRequired'));
      return;
    }
    setIsLoading(true);
    let formData = new FormData();
    if(img) {
      formData.append('file', img);
    }
    formData.append('name', itemState.name);
    formData.append('category', itemState.category ? itemState.category : "");
    formData.append('description', itemState.description ? itemState.description : "");
    formData.append('unit', itemState.unit ? itemState.unit : "");
    if (id) {
      if (!itemState.unit) {
        formData.append('amount', '0');
      } else {
        formData.append('amount', (itemState as ListItemNew).amount ? (itemState as ListItemNew).amount!.toString() : "1");
      }
      formData.append('saveItem', (itemState as ListItemNew).saveItem ? (itemState as ListItemNew).saveItem.toString() : "true");
    }
    await post(api_url, formData, (data) => {
      toast.success(t('itemAdded'));
      if (id) {
        if (lists.length > 0) {
          setLists((prev) => {
            const list = prev.find((list) => list._id === id);
            if (list) {
              const newList = {...list, items: list.items + 1};
              return [...prev.filter((list) => list._id !== id), newList];
            }
            return [...prev.filter((list) => list._id !== id)];
          });
        }
      }
      if (!id || (itemState as ListItemNew).saveItem) {
        if (items.items.length > 0) {
          const categories = new Set(items.categories);
          if (itemState.category) {
            categories.add(itemState.category);
          }
          setItems((prev) => ({...prev, items: [...prev.items, data.item], categories: Array.from(categories)}));
        }
      }
      (back.onBack as Function)();
    },{
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    });
    setIsLoading(false);
  }

  const onImgIconClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setItemState((prev) => ({...prev, img: URL.createObjectURL(files[0])}))
        setImg(files[0]);
      }
    }
  }

  const label = { inputProps: { 'aria-label': t("saveItem") } };

const getItems = async () => {
  setIsLoading(true);
  await get('/api/item/', (data) => {
    let itemsTemp: Item[] = data.items.map((item: Item) => ({
      ...item,
      imageMemo: <MemoizedImage className='item-img' src={item.img ? item.img : '/item.png'} alt={item.name} />
    }))
    setItems({items: itemsTemp, categories: data.categories, updated: new Date()});
    setCategories(data.categories);
  }, {
    'Authorization': `Bearer ${cookies.get('userToken')}`,
  })
  setIsLoading(false);
}

  useEffect(() => {
    if (!items.items.length || getMinutesBetweenDates(items.updated, new Date()) > 10) {
      getItems();
    }
  }, []);

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
          <ItemDetails categories={categories} onAutoCompleteChange={onAutoCompleteChange} amountEdit={id !== undefined} onImgIconClick={onImgIconClick} img={itemState.img} onSelectionChange={onSelectionChange} onChange={onChange} addCounter={addCounter} removeCounter={removeCounter} item={itemState} />
          {id && <FormControlLabel control={<Checkbox name="saveItem" onChange={onChecked} checked={itemState.saveItem} {...label} color="success" icon={<CiCircleMinus size={'1.5rem'} color='white' />} checkedIcon={<IoAddCircleSharp size={'1.5rem'} />} />} label={t("saveItem")} />}
          <GlassButton endIcon={<IoMdAdd size={"1.5rem"} color='white'/>} text={t('create')} style={{width: "100%", color: "white"}} type="submit"/>
        </form>
    </main>
  )
}

export default ItemNew