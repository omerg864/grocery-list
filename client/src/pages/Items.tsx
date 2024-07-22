import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import Item from '../interface/ItemInterface';
import SearchBar from '../components/SearchBar/SearchBar';
import CategoryList from '../components/CategoryList/CategoryList';
import ItemsList from '../components/ItemsList/ItemsList';
import Loading from '../components/Loading/Loading';

function Items() {

  const { t } = useTranslation('translation', { keyPrefix: 'Items' });
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([{id: "1", name: 'Item 1', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc"}, {id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "KG"}]);
  const [displayedItems, setDisplayedItems] = useState<Item[]>(items);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>(["Fruits", "Home Essentials"]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const goToNewItem = () => {
    navigate('/items/new');
  }

  const filterItems = (search: string) => {
    const filteredItems = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    setDisplayedItems(filteredItems);
  }

  const onSelect = (category: string) => {
    if (category === selectedCategory) {
      setSelectedCategory("All");
      return;
    }
    setSelectedCategory(category);
  }

  const onSwipeRight = async (id: string) => {
    console.log('swiped right', id);
    setIsLoading(true);
    setTimeout(() => {
      setItems(items.filter(item => item.id !== id));
      setIsLoading(false);
    }, 1000);
  }

  const onSwipeLeft = (id: string) => {
    console.log('swiped left', id);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
    <Header title={t('items')} buttonClick={goToNewItem} buttonTitle={t('newItem')} />
    <SearchBar onSearch={filterItems} placeholder={t("search")} />
    <CategoryList containerStyle={{padding: '8px'}} categories={categories} selectedCategory={selectedCategory} onSelect={onSelect} />
    <ItemsList items={displayedItems} onSwipeRight={onSwipeRight} onSwipeLeft={onSwipeLeft} />
  </main>
  )
}

export default Items