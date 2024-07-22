import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import Item from '../interface/ItemInterface';
import SearchBar from '../components/SearchBar/SearchBar';
import CategoryList from '../components/CategoryList/CategoryList';
import ItemsList from '../components/ItemsList/ItemsList';

function Items() {

  const { t } = useTranslation('translation', { keyPrefix: 'Items' });
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([{id: "1", name: 'Item 1', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc", amount: 2}, {id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "KG", amount: 2}]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>(["Fruits", "Home Essentials"]);

  const goToNewItem = () => {
    navigate('/items/new');
  }

  const filterItems = (search: string) => {
    const filteredItems = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    setItems(filteredItems);
  }

  const onSelect = (category: string) => {
    if (category === selectedCategory) {
      setSelectedCategory("All");
      return;
    }
    setSelectedCategory(category);
  }





  return (
    <main>
    <Header title={t('items')} buttonClick={goToNewItem} buttonTitle={t('newItem')} />
    <SearchBar onSearch={filterItems} placeholder={t("search")} />
    <CategoryList categories={categories} selectedCategory={selectedCategory} onSelect={onSelect} />
  </main>
  )
}

export default Items