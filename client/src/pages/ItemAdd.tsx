import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ItemDetails from "../components/ItemDetails/ItemDetails";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading";
import GlassButton from "../components/GlassButton/GlassButton";
import { MdAdd } from "react-icons/md";
import ListItem from "../interface/ListItemInterface";
import { useRecoilState } from "recoil";
import { itemAtom } from "../recoil/atoms";
import { getMinutesBetweenDates } from "../utils/functions";
import { post } from "../utils/apiRequest";
import Cookies from "universal-cookie";



function ItemAdd() {

  const { id } = useParams<{ id: string, item: string, bundle: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'ItemAdd' });
  const navigate = useNavigate();
  const [itemState, setItemState] = useRecoilState<ListItem>(itemAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cookies = new Cookies();

  const back = () => {
    setItemState({
      _id: '',
      name: '',
      category: '',
      amount: 0,
      unit: 'pc',
      description: '',
    });
    navigate(`/lists/${id}/select`);
  }

  const onImgIconClick = () => {
    if (navigator.share) {
          navigator.share({
            title: t('shareTitle'),
            text: t('shareText'),
            url: `${import.meta.env.VITE_API_URL}/share/item/${itemState._id}`, // Replace with your link
          });
      } else {
        toast.info(t('linkCopied'));
        navigator.clipboard.writeText(`${import.meta.env.VITE_API_URL}/share/item/${itemState._id}`); // Replace with your link
      }
  }

  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let amountTemp: number | string = e.target.value;
    if (amountTemp !== "") {
        amountTemp = parseInt(amountTemp);
    }
    setItemState({...itemState, amount: amountTemp});
  }

  const addCounter = () => {
    let amount = itemState.amount;
    if (typeof amount === 'number') {
      amount = amount + 1;
    } else {
      amount = 1;
    }
    setItemState({...itemState, amount});
  }

  const removeCounter = () => {
    let amount = itemState.amount;
    if (typeof amount !== 'number' || amount as number <= 1) {
      amount = 1;
    } else {
      amount = amount as number - 1;
    }
    setItemState({...itemState, amount});
  }

  const addItem = async () => {
    setIsLoading(true);
    let formData = new FormData();
    if (!itemState.unit) {
      formData.append('amount', '0');
    } else {
      formData.append('amount', itemState.amount!.toString());
    }
    await post(`/api/list/${id}/item/${itemState._id}`, formData, (_) => {
      setItemState({
        _id: '',
        name: '',
        category: '',
        amount: 0,
        unit: 'pc',
        description: '',
      });
      toast.success(t('ItemAdded'));
      navigate(`/lists/${id}/select`);
    }, {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    });
    setIsLoading(false);
  }

  const getItem = async () => {
    setIsLoading(true);
    setIsLoading(false);
  }

  useEffect(() => {
    if (!itemState._id || itemState._id !== id || getMinutesBetweenDates(itemState.stateUpdated as Date, new Date()) > 10) {
      getItem();
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
        <Header title={itemState.name} onBack={back}/>
        <form className="list-form" style={{position: 'relative', paddingTop: '5.5rem'}} onSubmit={addItem}>
          <ItemDetails enableAmount={true} onImgIconClick={onImgIconClick} addCounter={addCounter} removeCounter={removeCounter} onChange={onChangeAmount}  disabled={true} item={itemState} />
          <GlassButton endIcon={<MdAdd size={"1.5rem"} color='white'/>} text={t('add')} style={{width: "100%", color: "white"}} type="submit"/>
        </form>
    </main>
  )
}

export default ItemAdd