import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';
import Bundle from '../interface/BundleInterface';
import { useState } from 'react';
import BundleList from '../components/BundleList/BundleList';
import ConfirmationDialog from '../components/ConfirmationDialog/ConfirmationDialog';
import Loading from '../components/Loading/Loading';


function Bundles() {

  const { t } = useTranslation('translation', { keyPrefix: 'Bundles' });
  const [bundles, setBundles] = useState<Bundle[]>([
    {
      id: "1",
      title: 'Bundle 1',
      items: [
        {id: "1", name: 'Item 1', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc"},
        {id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"}
      ]
    },
    {
      id: "2",
      title: 'Bundle 2',
      items: [
        {id: "1", name: 'Item 1', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc"},
        {id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
        {id: "3", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
        {id: "4", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
        {id: "5", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"}
      ]
    }
  ]);
  const [displayedBundles, setDisplayedBundles] = useState<Bundle[]>(bundles);
  const [open, setOpen] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const filterBundles = (search: string) => {
    const filteredBundles = bundles.filter(bundle => bundle.title.toLowerCase().includes(search.toLowerCase()));
    setDisplayedBundles(filteredBundles);
  }

  const goToNewBundle = () => {
    navigate('/bundles/new');
  }

  const onSwipeRight = (id: string) => {
    console.log('swiped right', id);
    setOpen(id);
  }

  const deleteBundle = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      handleClose();
      setBundles(bundles.filter(bundle => bundle.id !== id));
      setDisplayedBundles(displayedBundles.filter(bundle => bundle.id !== id));
      setIsLoading(false);
    }, 1000);
  }

  const onItemClicked = (id: string) => {
    navigate(`/bundles/${id}`);
  }

  const handleClose = () => {
    setOpen('');
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <Header title={t('bundles')} buttonTitle={t('newBundle')} buttonClick={goToNewBundle} />
      <SearchBar onSearch={filterBundles} placeholder={t('search')} />
      <ConfirmationDialog open={open !== ''} content={t('deleteBundleContent')} title={t('deleteBundle')} handleClose={handleClose} handleConfirm={() => deleteBundle(open)} />
      <BundleList onItemClick={onItemClicked} onSwipeRight={onSwipeRight} bundles={displayedBundles} />
    </main>
  )
}

export default Bundles