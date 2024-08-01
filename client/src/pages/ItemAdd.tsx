import Item from "../interface/ItemInterface";
import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ItemDetails from "../components/ItemDetails/ItemDetails";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading";
import GlassButton from "../components/GlassButton/GlassButton";
import { MdAdd } from "react-icons/md";



function ItemAdd() {

  const { id } = useParams<{ id: string, item: string, bundle: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'ItemAdd' });
  const navigate = useNavigate();
  const [itemState, setItemState] = useState< Omit<Item, 'amount'> & {amount: number | string}>({
    _id: "",
    name: '',
    category: "",
    img: "",
    description: "",
    unit: "",
    amount: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const back = () => {
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
    console.log(typeof amount);
    if (typeof amount === 'string') {
      amount = 1;
    } else {
      amount = amount + 1;
    }
    setItemState({...itemState, amount});
  }

  const removeCounter = () => {
    let amount = itemState.amount;
    if (amount === "" || amount as number <= 1) {
      amount = 1;
    } else {
      amount = amount as number - 1;
    }
    setItemState({...itemState, amount});
  }

  const addItem = async () => {
    setIsLoading(true);
    try {
        // await addItem(itemState);
        setIsLoading(false);
        navigate(`/lists/${id}/select`);
    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setItemState({
        _id: "1",
        name: 'Banana',
        category: "Fruits",
        img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
        description: "only yellow ones",
        unit: "pc",
        amount: 1
      });
      setIsLoading(false);
    }, 1000);
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