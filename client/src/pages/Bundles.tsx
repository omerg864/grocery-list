import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';
import Bundle from '../interface/BundleInterface';
import { useEffect, useState } from 'react';
import BundleList from '../components/BundleList/BundleList';
import ConfirmationDialog from '../components/ConfirmationDialog/ConfirmationDialog';
import Loading from '../components/Loading/Loading';
import { del, get } from '../utils/apiRequest';
import Cookies from 'universal-cookie';


function Bundles() {

  const { t } = useTranslation('translation', { keyPrefix: 'Bundles' });
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [displayedBundles, setDisplayedBundles] = useState<Bundle[]>(bundles);
  const [open, setOpen] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const cookies = new Cookies();

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

  const deleteBundle = async (id: string) => {
    setIsLoading(true);
    await del(`/api/bundle/${id}`, (_) => {
      handleClose();
      setBundles(bundles.filter(bundle => bundle._id !== id));
      setDisplayedBundles(displayedBundles.filter(bundle => bundle._id !== id));
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    });
    setIsLoading(false);
  }

  const onItemClicked = (id: string) => {
    navigate(`/bundles/${id}`);
  }

  const handleClose = () => {
    setOpen('');
  }

  const getBundles = async () => {
    setIsLoading(true);
    await get('/api/bundle', (data) => {
      setBundles(data.bundles);
      setDisplayedBundles(data.bundles);
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    })
    setIsLoading(false);
  }

  useEffect(() => {
    getBundles();
  }, []);

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