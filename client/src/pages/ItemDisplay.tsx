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
import { get } from "../utils/apiRequest";
import Cookies from "universal-cookie";



function ItemDisplay() {

  const { id, item, bundle } = useParams<{ id: string, item: string, bundle: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'ItemDisplay' });
  const navigate = useNavigate();
  const [itemState, setItemState] = useState<Item>({
    _id: "",
    name: '',
    category: "",
    img: "",
    description: "",
    unit: "",
    amount: 0
  });
  const [_, setItem] = useRecoilState<Item>(itemAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cookies = new Cookies();


  let back = {}
  let edit;
  let side;

  let path = window.location.pathname.split('/')[1];

  switch (path) {
    case 'lists':
      if (bundle) {
        back = {
          onBack: () => navigate(`/lists/${id}/add/bundle/${bundle}`)
        }
      } else {
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
      }
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
            url: `${import.meta.env.VITE_API_URL}/share/item/${itemState._id}`, // Replace with your link
          });
      } else {
        toast.info(t('linkCopied'));
        navigator.clipboard.writeText(`${import.meta.env.VITE_API_URL}/share/item/${itemState._id}`); // Replace with your link
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
    getItem();
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