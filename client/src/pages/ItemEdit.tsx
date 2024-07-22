import Item from "../interface/ItemInterface";
import Header from "../components/Header/Header";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconButton, SelectChangeEvent } from "@mui/material";
import { MdModeEditOutline } from "react-icons/md";
import ItemDetails from "../components/ItemDetails/ItemDetails";
import GlassButton from "../components/GlassButton/GlassButton";
import Loading from "../components/Loading/Loading";
import { useTranslation } from "react-i18next";
import { HiOutlineSave } from "react-icons/hi";



function ItemEdit() {

  const { id, item } = useParams<{ id: string, item: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'ItemEdit' });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemState, setItemState] = useState<Item>({id: "1", name: 'Banana', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "only yellow ones", unit: "pc", amount: 2});


  let back: any = {};

  if (item) {
    back = {
      onBack: () => navigate(`/lists/${id}/item/${item}`)
    }
  } else {
    back = {
      onBack: () => navigate(`/items/${id}`)
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
    setItemState(prev => ({...prev, amount: prev.amount + 1}));
  }

  const removeCounter = () => {
    setItemState(prev => ({...prev, amount: prev.amount - 1}));
  }

  const updateItem = async () => {
    setIsLoading(true);
    try {
        // await updateItem(itemState);
        setIsLoading(false);
        (back.onBack as Function)();
    } catch (error) {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
        <Header title={itemState.name} {...back} />
        <form className="list-form" style={{position: 'relative', paddingTop: '5.5rem'}} onSubmit={updateItem}>
          <ItemDetails onSelectionChange={onSelectionChange} onChange={onChange} addCounter={addCounter} removeCounter={removeCounter} item={itemState} />
          <GlassButton endIcon={<HiOutlineSave size={"1.5rem"} color='white'/>} text={t('save')} style={{width: "100%", color: "white"}} type="submit"/>
        </form>
    </main>
  )
}

export default ItemEdit