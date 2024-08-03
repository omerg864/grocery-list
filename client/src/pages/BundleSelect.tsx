import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';
import Bundle from '../interface/BundleInterface';
import { useEffect, useState } from 'react';
import BundleList from '../components/BundleList/BundleList';
import { useRecoilState } from 'recoil';
import { bundleAtom, bundlesAtom, updatedBundlesAtom } from '../recoil/atoms';
import Loading from '../components/Loading/Loading';
import Cookies from 'universal-cookie';
import { get } from '../utils/apiRequest';
import { getMinutesBetweenDates } from '../utils/functions';


function BundleSelect() {

  const { t } = useTranslation('translation', { keyPrefix: 'BundleSelect' });
  const [bundles, setBundles] = useRecoilState<Bundle[]>(bundlesAtom);
  const [ updatedBundles, setUpdatedBundles] = useRecoilState<Date>(updatedBundlesAtom);
  const { id } = useParams();
  const [_, setBundle] = useRecoilState<Bundle>(bundleAtom);
  const [displayedBundles, setDisplayedBundles] = useState<Bundle[]>(bundles);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filterBundles = (search: string) => {
    const filteredBundles = bundles.filter(bundle => bundle.title.toLowerCase().includes(search.toLowerCase()));
    setDisplayedBundles(filteredBundles);
  }

  const onItemClicked = (bundleId: string) => {
    const bundle = bundles.find(bundle => bundle._id === bundleId);
    setBundle(bundle!);
    navigate(`/lists/${id}/add/bundle/${bundleId}`);
  }

  const back = () => {
    navigate(`/lists/${id}/select`);
  }

  const getBundles = async () => {
    setIsLoading(true);
    await get('/api/bundle', (data) => {
      setBundles(data.bundles);
      setUpdatedBundles(new Date());
      setDisplayedBundles(data.bundles);
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    })
    setIsLoading(false);
  }

  useEffect(() => {
    if (bundles.length === 0 || getMinutesBetweenDates(updatedBundles, new Date()) > 10) {
      getBundles();
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <Header title={t('selectBundle')} onBack={back}  />
      <SearchBar onSearch={filterBundles} placeholder={t('search')} />
      <BundleList onItemClick={onItemClicked} bundles={displayedBundles} />
    </main>
  )
}

export default BundleSelect