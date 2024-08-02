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
import Cookies from 'universal-cookie';
import { get } from '../utils/apiRequest';

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
    const cookies = new Cookies();

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

    const onItemClicked = (itemId: string) => {
        let path = window.location.pathname.split('/')[1];
        let edit = window.location.pathname.split('/')[3];
        switch (path) {
            case 'bundles':
                setBundle((prevBundle) => ({
                    ...prevBundle!,
                    items: [...prevBundle!.items, items.find((item) => item._id === itemId)!]
                }))
                if (edit === 'edit') {
                    navigate(`/bundles/${id}/edit`);
                    return;
                } else {
                    navigate(`/bundles/new`);
                    return;
                }
                break;
            case 'lists':
                navigate(`/lists/${id}/add/item/${itemId}`);
                break;
        }
    }

    const getItems = async () => {
        setIsLoading(true);
        await get('/api/item', (data) => {
            let itemsTemp = data.items.filter((item: Item) => !bundle.items.find(bundleItem => bundleItem._id === item._id));
            setItems(itemsTemp);
            setDisplayedItems(itemsTemp);
            setCategories(data.categories);
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        })
        setIsLoading(false);
    }

    useEffect(() => {
        getItems();
    }, []);


    let path = window.location.pathname.split('/')[1];
    let back;
    switch (path) {
        case 'bundles':
            back = {
                onBack: () => {
                    if (window.location.pathname.split('/')[3] === 'edit') {
                        navigate(`/bundles/${id}/edit`)
                    } else {
                        navigate(`/bundles/new`)
                    }
            }
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