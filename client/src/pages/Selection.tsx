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
import { listAtom } from '../recoil/atoms';
import { get } from '../utils/apiRequest';
import Item from '../interface/ItemInterface';
import MemoizedImage from '../components/MemoizedImage/MemoizedImage';
import Bundle from '../interface/BundleInterface';
import { BUNDLE_SELECTION_LIMIT, ITEM_SELECTION_LIMIT } from '../utils/requestsConst';

function Selection() {

    const { t } = useTranslation('translation', { keyPrefix: 'Selection' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [list, _] = useRecoilState(listAtom);
    const { id } = useParams();
    const cookies = new Cookies();

    const backClick = () => {
        navigate(`/lists/${id}`);
    }

    const buttonClick = () => {
        navigate(`/lists/${id}/new/item`);
    }

    const onItemClicked = (itemId: string) => {
        navigate(`/lists/${id}/add/item/${itemId}`);
    }

    const onBundleClicked = (bundleId: string) => {
        navigate(`/lists/${id}/add/bundle/${bundleId}`);
    }

    const getItems = async () => {
        await get(`/api/item/?limit=${ITEM_SELECTION_LIMIT}&category=false`, (data) => {
            let itemsTemp: Item[] = data.items.map((item: Item) => ({
                ...item,
                imageMemo: <MemoizedImage className='item-img' src={item.img ? item.img : '/item.png'} alt={item.name} />
            }))
            setItems(itemsTemp);
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        })
    }

    const getBundles = async () => {
        await get(`/api/bundle?limit=${BUNDLE_SELECTION_LIMIT}`, (data) => {
            setBundles(data.bundles);
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        })
    };

    const getAll = async () => {
        setIsLoading(true);
        Promise.all([getItems(), getBundles()])
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
            <BundleList bundles={bundles} onItemClick={onBundleClicked}/>
        </Fragment>}
        {items.length > 0 && <Fragment>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '10px 0 '}}>
            <Typography variant="h6">{t('items')}</Typography>
            <Link to={`/lists/${id}/select/item`}>{t('allItems')}</Link>
            </div>
            <ItemsList items={items} onItemClicked={onItemClicked} />
        </Fragment>}
        {items.length === 0 && bundles.length === 0 && <Typography variant="h6">{t('noItems')}</Typography>}
    </main>
  )
}

export default Selection