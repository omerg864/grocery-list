import { useState } from 'react'
import Header from '../components/Header/Header';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import { Typography } from '@mui/material';
import BundleList from '../components/BundleList/BundleList';
import ItemsList from '../components/ItemsList/ItemsList';

function Selection() {

    const { t } = useTranslation('translation', { keyPrefix: 'Selection' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [bundles, setBundles] = useState([
        {id: "1", title: 'Bundle 1', items: [
            {id: "1", name: 'Item 1', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc"},
            {id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"}
        ]},
        {id: "2", title: 'Bundle 2', items: [
            {id: "1", name: 'Item 1', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc"},
            {id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
            {id: "3", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
            {id: "4", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
            {id: "5", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"}
        ]
        }
    ]);
    const [items, setItems] = useState([
        {id: "1", name: 'Item 1', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc"},
        {id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"}
    ]);
    const { id } = useParams();

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

    if (isLoading) {
        return <Loading />;
    }

  return (
    <main>
        <Header title={t('selectItem')} onBack={backClick} buttonClick={buttonClick} buttonTitle={t('newItem')} />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <Typography variant="h6">{t('bundles')}</Typography>
          <Link to={`/lists/${id}/select/bundle`}>{t('allBundles')}</Link>
        </div>
        <BundleList bundles={bundles} onItemClick={onBundleClicked}/>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '10px 0 '}}>
          <Typography variant="h6">{t('items')}</Typography>
          <Link to={`/lists/${id}/select/item`}>{t('allItems')}</Link>
        </div>
        <ItemsList items={items} onItemClicked={onItemClicked} />
    </main>
  )
}

export default Selection