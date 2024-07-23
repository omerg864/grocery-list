import Item from "../interface/ItemInterface";
import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { MdModeEditOutline } from "react-icons/md";
import ItemDetails from "../components/ItemDetails/ItemDetails";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading";
import { useRecoilState } from "recoil";
import { itemAtom } from "../recoil/atoms";



function ItemDisplay() {

  const { id, item } = useParams<{ id: string, item: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'ItemDisplay' });
  const navigate = useNavigate();
  const [itemState, setItemState] = useState<Item>({
    id: "",
    name: '',
    category: "",
    img: "",
    description: "",
    unit: "",
    amount: 0
  });
  const [_, setItem] = useRecoilState<Item>(itemAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  let back = {}
  let edit;
  let side;

  let path = window.location.pathname.split('/')[1];

  switch (path) {
    case 'lists':
      back = {
        onBack: () => navigate(`/lists/${id}`)
      }
      edit = () => {
        setItem(itemState);
        navigate(`/lists/${id}/item/${item}/edit`)
      }
      side = {sideButton: <IconButton onClick={edit}>
      <MdModeEditOutline color="white"/>
    </IconButton>}
      break;
    case 'bundles':
      let editPath = window.location.pathname.split('/')[3];
      if (editPath === 'edit') {
        back = {
          onBack: () => navigate(`/bundles/${id}/edit`)
        }
      } else {
        back = {
          onBack: () => navigate(`/bundles/${id}/`)
        }
      }
      break;
    case 'items':
      back = {
        onBack: () => navigate('/items')
      }
      edit = () => {
        setItem(itemState);
        navigate(`/items/${id}/edit`)
      }
      side = {sideButton: <IconButton onClick={edit}>
      <MdModeEditOutline color="white"/>
    </IconButton>}
      break;
  }

  const onImgIconClick = () => {
    if (navigator.share) {
          navigator.share({
            title: t('shareTitle'),
            text: t('shareText'),
            url: `${import.meta.env.VITE_API_URL}/share/item/${itemState.id}`, // Replace with your link
          });
      } else {
        toast.info(t('linkCopied'));
        navigator.clipboard.writeText(`${import.meta.env.VITE_API_URL}/share/item/${itemState.id}`); // Replace with your link
      }
  }

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setItemState({
        id: "1",
        name: 'Banana',
        category: "Fruits",
        img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
        description: "only yellow ones",
        unit: "pc",
        amount: 2
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
        <Header title={itemState.name} {...back} {...side}/>
        <div className="list-form" style={{position: 'relative', paddingTop: '5.5rem'}}>
          <ItemDetails onImgIconClick={onImgIconClick} disabled={true} item={itemState} />
        </div>
    </main>
  )
}

export default ItemDisplay