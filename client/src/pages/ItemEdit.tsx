import Item from "../interface/ItemInterface";
import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SelectChangeEvent, TextField, ThemeProvider, useTheme } from "@mui/material";
import ItemDetails from "../components/ItemDetails/ItemDetails";
import GlassButton from "../components/GlassButton/GlassButton";
import Loading from "../components/Loading/Loading";
import { useTranslation } from "react-i18next";
import { HiOutlineSave } from "react-icons/hi";
import formTheme from "../themes/formTheme";
import { useRecoilState } from "recoil";
import { itemAtom } from "../recoil/atoms";
import { get, put } from "../utils/apiRequest";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import ListItem from "../interface/ListItemInterface";



function ItemEdit() {

  const { id, item } = useParams<{ id: string, item: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'ItemEdit' });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemState, setItemState] = useRecoilState<Item | ListItem>(itemAtom);
  const [img, setImg] = useState<File | null>(null);
  const cookies = new Cookies();

  const outerTheme = useTheme();


  let back: any = {};
  let api_url = `/api/item/${id}`;

  if (item) {
    back = {
      onBack: () => {
        setItemState({_id: "", name: '', category: "", img: "", description: "", unit: "", amount: 0});
        navigate(`/lists/${id}/item/${item}`)
      }
    }
    api_url = `/api/listitem/${item}`;
  } else {
    back = {
      onBack: () => {
        setItemState({_id: "", name: '', category: "", img: "", description: "", unit: "", amount: 0});
        navigate(`/items/${id}`)
      }
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setItemState(prev => ({...prev, [name]: value}));
  }

  const onSelectionChange = (e: SelectChangeEvent) => {
    const value = e.target.value as string;
    setItemState(prev => ({...prev, unit: value}));
  }

  const addCounter = () => {
    setItemState(prev => ({...prev, amount: (prev as ListItem).amount! + 1}));
  }

  const removeCounter = () => {
    setItemState(prev => ({...prev, amount: (prev as ListItem).amount! - 1}));
  }

  const updateItem = async () => {
    setIsLoading(true);
    let formData = new FormData();
    if(img) {
      formData.append('file', img);
    }
    formData.append('name', itemState.name);
    formData.append('category', itemState.category ? itemState.category : "");
    formData.append('description', itemState.description ? itemState.description : "");
    formData.append('unit', itemState.unit ? itemState.unit : "");
    if (typeof itemState === 'object' && 'amount' in itemState) {
      formData.append('amount', itemState.amount ? itemState.amount.toString() : "");
    }
    await put(api_url, formData, (_) => {
      if (item) {
        navigate(`/lists/${id}/item/${item}`);
      } else {
        navigate(`/items/${id}`);
      }
      toast.success('itemUpdated')
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
      'Content-Type': 'multipart/form-data',
    })
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

  const getItem = async () => {
    setIsLoading(true);
    await get(`/api/item/${id}`, (data) => {
      setItemState(data.item);
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    })
    setIsLoading(false);
  }

  useEffect(() => {
    let itemId;
    if (item) {
      itemId = item;
    } else {
      itemId = id;
    }
    if (!itemState._id || itemState._id != itemId) {
      getItem();
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
        <Header title={itemState.name} {...back} />
        <form className="list-form" style={{position: 'relative', paddingTop: '5.5rem'}} onSubmit={updateItem}>
          <ThemeProvider theme={formTheme(outerTheme)}>
          <TextField required name="name" color='success' className='white-color-input' fullWidth value={itemState.name} label={t('name')} onChange={onChange} variant="outlined" />
          </ThemeProvider>
          <ItemDetails onImgIconClick={onImgIconClick} onSelectionChange={onSelectionChange} onChange={onChange} addCounter={addCounter} removeCounter={removeCounter} item={itemState} />
          <GlassButton endIcon={<HiOutlineSave size={"1.5rem"} color='white'/>} text={t('save')} style={{width: "100%", color: "white"}} type="submit"/>
        </form>
    </main>
  )
}

export default ItemEdit