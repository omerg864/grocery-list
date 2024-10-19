import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import { FormEvent, useEffect, useState } from 'react';
import Item, { itemDefault } from '../interface/ItemInterface';
import Cookies from 'universal-cookie';
import { get, post } from '../utils/apiRequest';
import Loading from '../components/Loading/Loading';
import { itemsDataAtom } from '../recoil/atoms';
import { useRecoilState } from 'recoil';
import ItemDetails from '../components/ItemDetails/ItemDetails';
import GlassButton from '../components/GlassButton/GlassButton';
import { IoMdAdd } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

function ShareItem() {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item>(itemDefault);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useRecoilState(itemsDataAtom);
  const cookies = new Cookies();
  const { t } = useTranslation('translation', { keyPrefix: 'ShareItem' });

  const path = window.location.pathname.split('/')[2];

  const getItem = async () => {
    setIsLoading(true);
    let url = `/api/item/${id}`
    if (path === 'listitem') {
      url = `/api/listItem/${id}/share`
    }
    await get(url, (data) => {
      setItem(data.item);
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    })
    setIsLoading(false);
  }

  const copyItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    let url = `/api/item/${id}/share`
    if (path === 'listitem') {
      url = `/api/listItem/${id}/share`
    }
    await post(url, {}, (data) => {
      if (items.items.length > 0) {
        const categories = new Set(items.categories);
        if (data.item.category) {
          categories.add(data.item.category);
        }
        setItems((prev) => ({...prev, items: [...prev.items, data.item], categories: Array.from(categories)}));
      }
      toast.success(t('itemAdded'));
      navigate(`/items`);
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    })
    setIsLoading(false);
  }

  const back = () => {
    navigate('/items');
  }


  useEffect(() => {
    getItem();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }


  return (
    <main>
      <Header title={item.name} onBack={back} />
      <form className="list-form" style={{position: 'relative', paddingTop: '5.5rem'}} onSubmit={copyItem}>
        <ItemDetails item={item}  share={true} disabled={true}/>
        <GlassButton endIcon={<IoMdAdd size={"1.5rem"} color='white'/>} text={t('addToItems')} style={{width: "100%", color: "white"}} type="submit"/>
      </form>
    </main>
  )
}

export default ShareItem