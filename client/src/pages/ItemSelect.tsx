import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryList from '../components/CategoryList/CategoryList';
import SearchBar from '../components/SearchBar/SearchBar';
import ItemsList from '../components/ItemsList/ItemsList';
import { useEffect, useState } from 'react';
import Item from '../interface/ItemInterface';
import { useRecoilState } from "recoil";
import Bundle from '../interface/BundleInterface';
import { bundleAtom } from '../recoil/atoms';
import Loading from '../components/Loading/Loading';

function ItemSelect() {
    const { t } = useTranslation('translation', { keyPrefix: 'ItemSelect' });
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<string[]>(["Fruits", "Home Essentials"]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [bundle, setBundle] = useRecoilState<Bundle>(bundleAtom);
    const [items, setItems] = useState<Item[]>([]);
    const [displayedItems, setDisplayedItems] = useState<Item[]>([]);

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

    const onItemClicked = (id: string) => {
        let path = window.location.pathname.split('/')[1];
        switch (path) {
            case 'bundles':
                setBundle((prevBundle) => ({
                    ...prevBundle!,
                    items: [...prevBundle!.items, items.find((item) => item.id === id)!]
                }))
                navigate(`/bundles/${id}/edit`);
                break;
            case 'lists':
                navigate(`/lists/${id}/add/item/${id}`);
                break;
        }
    }

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            let itemsTemp = [{id: "3", name: 'Item 3', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc"}, {id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "KG"}];
            itemsTemp = itemsTemp.filter(item => !bundle.items.find(bundleItem => bundleItem.id === item.id));
            setItems(itemsTemp);
            setDisplayedItems(itemsTemp);
            setIsLoading(false);
        }, 1000);
    }, []);


    let path = window.location.pathname.split('/')[1];
    let back;
    switch (path) {
        case 'bundles':
            back = {
                onBack: () => navigate(`/bundles/${id}/edit`)
            }
            break;
        case 'lists':
            back = {
                onBack: () => navigate(`/lists/${id}/select`)
            }
            break;
    }

    if (isLoading) {
        return <Loading />;
    }
  return (
    <main>
        <Header title={t('selectItem')} {...back} />
        <SearchBar onSearch={filterItems} placeholder={t("search")} />
        <CategoryList containerStyle={{padding: '8px'}} categories={categories} selectedCategory={selectedCategory} onSelect={onSelect} />
        <ItemsList onItemClicked={onItemClicked} items={displayedItems} />
    </main>
  )
}

export default ItemSelect