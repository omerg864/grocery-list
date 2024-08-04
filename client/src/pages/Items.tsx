import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import Item from '../interface/ItemInterface';
import SearchBar from '../components/SearchBar/SearchBar';
import CategoryList from '../components/CategoryList/CategoryList';
import ItemsList from '../components/ItemsList/ItemsList';
import Loading from '../components/Loading/Loading';
import ConfirmationDialog from '../components/ConfirmationDialog/ConfirmationDialog';
import { del, get } from '../utils/apiRequest';
import Cookies from 'universal-cookie';
import MemoizedImage from "../components/MemoizedImage/MemoizedImage";
import { useRecoilState } from 'recoil';
import { itemsDataAtom } from '../recoil/atoms';
import { getMinutesBetweenDates } from '../utils/functions';
import { IconButton } from '@mui/material';
import { LuRefreshCw } from "react-icons/lu";

function Items() {

  const { t } = useTranslation('translation', { keyPrefix: 'Items' });
  const navigate = useNavigate();
  const [itemsData, setItemsData] = useRecoilState(itemsDataAtom);
  const [items, setItems] = useState<Item[]>(itemsData.items);
  const [displayedItems, setDisplayedItems] = useState<Item[]>(items);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>(itemsData.categories);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<string>('');
  const cookies = new Cookies();

  const goToNewItem = () => {
    navigate('/items/new');
  }

  const filterItems = (search: string) => {
    let filteredItems = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory !== "All") {
      filteredItems = filteredItems.filter(item => item.category === selectedCategory);
      setDisplayedItems(filteredItems);
    }
    setDisplayedItems(filteredItems);
  }

  const onSelect = (category: string) => {
    const filter = category === selectedCategory ? "All" : category;
    setSelectedCategory(filter);
    if (filter === "All") {
      setDisplayedItems(items);
    } else {
      const filteredItems = items.filter(item => item.category === category);
      setDisplayedItems(filteredItems);
    }
  }

  const onSwipeRight = async (id: string) => {
    console.log('swiped right', id);
    setOpen(id);
  }

  const deleteItem = async (id: string) => {
    setIsLoading(true);
    await del(`/api/item/${id}`, (_) => {
      handleClose();
      setItems(items.filter(item => item._id !== id));
      setDisplayedItems(displayedItems.filter(item => item._id !== id));
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    });
    setIsLoading(false);
  }

  const onItemClicked = (id: string) => {
    navigate(`/items/${id}`);
  }

  const handleClose = () => {
    setOpen('');
  }

  const getItems = async () => {
    setIsLoading(true);
    await get('/api/item/', (data) => {
      let itemsTemp: Item[] = data.items.map((item: Item) => ({
        ...item,
        imageMemo: <MemoizedImage className='item-img' src={item.img ? item.img : '/item.png'} alt={item.name} />
      }))
      setItemsData({items: itemsTemp, categories: data.categories, updated: new Date()});
      setItems(itemsTemp);
      setDisplayedItems(itemsTemp);
      setCategories(data.categories);
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    })
    setIsLoading(false);
  }

  useEffect(() => {
    if (!itemsData.items.length || getMinutesBetweenDates(itemsData.updated, new Date()) > 10) {
      getItems();
    }
  }, [])

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
    <Header title={t('items')} buttonClick={goToNewItem} buttonTitle={t('newItem')} />
    <SearchBar onSearch={filterItems} placeholder={t("search")} />
    <div style={{display: 'flex', width: '100%'}}>
      <IconButton onClick={getItems}>
        <LuRefreshCw size={"1.5rem"} color='white'/>
      </IconButton>
      <CategoryList containerStyle={{padding: '8px'}} categories={categories} selectedCategory={selectedCategory} onSelect={onSelect} />
    </div>
    <ConfirmationDialog open={open !== ''} content={t('deleteItemContent')} title={t('deleteItem')} handleClose={handleClose} handleConfirm={() => deleteItem(open)}/>
    <ItemsList onItemClicked={onItemClicked} items={displayedItems} onSwipeRight={onSwipeRight} />
  </main>
  )
}

export default Items