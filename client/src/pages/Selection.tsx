import { Fragment, useEffect, useState } from 'react'
import Header from '../components/Header/Header';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import { Typography } from '@mui/material';
import BundleList from '../components/BundleList/BundleList';
import ItemsList from '../components/ItemsList/ItemsList';
import Cookies from 'universal-cookie';
import { useRecoilState } from 'recoil';
import { bundleAtom, bundlesAtom, itemAtom, itemsDataAtom, updatedBundlesAtom } from '../recoil/atoms';
import { get } from '../utils/apiRequest';
import Item from '../interface/ItemInterface';
import MemoizedImage from '../components/MemoizedImage/MemoizedImage';
import Bundle from '../interface/BundleInterface';
import { BUNDLE_SELECTION_LIMIT, ITEM_SELECTION_LIMIT } from '../utils/requestsConst';
import ListItem from '../interface/ListItemInterface';
import { getMinutesBetweenDates } from '../utils/functions';

function Selection() {

    const { t } = useTranslation('translation', { keyPrefix: 'Selection' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [bundles, setBundles] = useRecoilState<Bundle[]>(bundlesAtom);
    const [updatedBundles, setUpdatedBundles] = useRecoilState<Date>(updatedBundlesAtom);
    const [itemsData, setItemsData] = useRecoilState(itemsDataAtom);
    const [_, setItem] = useRecoilState<ListItem>(itemAtom);
    const [__, setBundle] = useRecoilState<Bundle>(bundleAtom);
    const { id } = useParams();
    const cookies = new Cookies();

    const backClick = () => {
        navigate(`/lists/${id}`);
    }

    const buttonClick = () => {
        navigate(`/lists/${id}/new/item`);
    }

    const onItemClicked = (itemId: string) => {
        const item = itemsData.items.find((item) => item._id === itemId)!;
        setItem({...item, amount: 1, stateUpdated: new Date()});
        navigate(`/lists/${id}/add/item/${itemId}`);
    }

    const onBundleClicked = (bundleId: string) => {
        const bundle = bundles.find((bundle) => bundle._id === bundleId)!;
        setBundle({...bundle, stateUpdated: new Date()});
        navigate(`/lists/${id}/add/bundle/${bundleId}`);
    }

    const getItems = async () => {
        await get(`/api/item/`, (data) => {
            let itemsTemp: Item[] = data.items.map((item: Item) => ({
                ...item,
                imageMemo: <MemoizedImage className='item-img' src={item.img ? item.img : '/item.png'} alt={item.name} />
            }))
            setItemsData({items: itemsTemp, categories: data.categories, updated: new Date()});
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        })
    }

    const getBundles = async () => {
        await get(`/api/bundle`, (data) => {
            setBundles(data.bundles);
            setUpdatedBundles(new Date());
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        })
    };

    const getAll = async () => {
        setIsLoading(true);
        const promises = [];
        if (itemsData.items.length === 0 || getMinutesBetweenDates(itemsData.updated, new Date()) > 10) {
            promises.push(getItems());
        }
        if (bundles.length === 0 || getMinutesBetweenDates(updatedBundles, new Date()) > 10) {
            promises.push(getBundles());
        }
        await Promise.all(promises);
        setIsLoading(false);
    }

    useEffect(() => {
        getAll();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

  return (
    <main>
        <Header title={t('selectItem')} onBack={backClick} buttonClick={buttonClick} buttonTitle={t('newItem')} />
        {bundles.length > 0 && <Fragment>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <Typography variant="h6">{t('bundles')}</Typography>
            <Link to={`/lists/${id}/select/bundle`}>{t('allBundles')}</Link>
            </div>
            <BundleList bundles={bundles.slice(0, BUNDLE_SELECTION_LIMIT)} onItemClick={onBundleClicked}/>
        </Fragment>}
        {itemsData.items.length > 0 && <Fragment>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '10px 0 '}}>
            <Typography variant="h6">{t('items')}</Typography>
            <Link to={`/lists/${id}/select/item`}>{t('allItems')}</Link>
            </div>
            <ItemsList items={itemsData.items.slice(0, ITEM_SELECTION_LIMIT)} onItemClicked={onItemClicked} />
        </Fragment>}
        {itemsData.items.length === 0 && bundles.length === 0 && <Typography variant="h6">{t('noItems')}</Typography>}
    </main>
  )
}

export default Selection