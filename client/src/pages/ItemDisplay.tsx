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
import { get, put } from "../utils/apiRequest";
import Cookies from "universal-cookie";
import ListItem from "../interface/ListItemInterface";
import { motion } from "framer-motion";
import useWindowDimensions from "../hooks/useWindowDimensions";



function ItemDisplay() {

  const { id, item, bundle } = useParams<{ id: string, item: string, bundle: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'ItemDisplay' });
  const navigate = useNavigate();
  const [itemState, setItemState] = useState<Item | ListItem>({
    _id: "",
    name: '',
    category: "",
    img: "",
    description: "",
    unit: "",
    amount: 0
  });
  const [_, setItem] = useRecoilState<Item | ListItem>(itemAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cookies = new Cookies();
  const dimensions = useWindowDimensions();


  let back = {}
  let edit;
  let side;

  let path = window.location.pathname.split('/')[1];
  let url = `/api/item/${id}`;
  let itemType = 'item';
  let list = false

  switch (path) {
    case 'lists':
      url = `/api/listitem/${item}`;
      itemType = 'listitem';
      list = true;
      if (bundle) {
        back = {
          onBack: () => navigate(`/lists/${id}/add/bundle/${bundle}`)
        }
        url = `/api/item/${item}`;
        itemType = 'item';
        list = false;
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
      url = `/api/item/${item}`;
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
            url: `${import.meta.env.VITE_HOST_URL}/share/${itemType}/${itemState._id}`, // Replace with your link
          });
      } else {
        toast.info(t('linkCopied'));
        navigator.clipboard.writeText(`${import.meta.env.VITE_HOST_URL}/share/${itemType}/${itemState._id}`); // Replace with your link
      }
  }
  
  const getItem = async () => {
    setIsLoading(true);
    await get(url, (data) => {
      setItemState({...data.item, stateUpdated: new Date()});
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    })
    setIsLoading(false);
  }

  const onDefaultIconClick = async (id: string) => {
    const defaultSate = (itemState as Item).default ? false : true;
    setItemState({...itemState, default: !defaultSate});
    await put(`/api/item/${id}/default`, {}, (data) => {
      setItemState({...itemState, default: data.default});
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    }, (message) => {
      toast.error(message);
      setItemState({...itemState, default: defaultSate});
    });
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
        <motion.div initial={{ y: dimensions.height + 500}} animate={{ y: 0 }}
    exit={{ y: 0 }}
    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="list-form" style={{position: 'relative', paddingTop: '5.5rem'}}>
          <ItemDetails onDefaultIconClick={onDefaultIconClick} amountEdit={list} onImgIconClick={onImgIconClick} disabled={true} item={itemState} />
        </motion.div>
    </main>
  )
}

export default ItemDisplay