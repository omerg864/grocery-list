import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';
import Bundle from '../interface/BundleInterface';
import { useEffect, useState } from 'react';
import BundleList from '../components/BundleList/BundleList';
import { useRecoilState } from 'recoil';
import { bundleAtom } from '../recoil/atoms';
import Loading from '../components/Loading/Loading';


function BundleSelect() {

  const { t } = useTranslation('translation', { keyPrefix: 'BundleSelect' });
  const [bundles, setBundles] = useState<Bundle[]>([
    {
      _id: "1",
      title: 'Bundle 1',
      items: [
        {_id: "1", name: 'Item 1', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc"},
        {_id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"}
      ]
    },
    {
      _id: "2",
      title: 'Bundle 2',
      items: [
        {_id: "1", name: 'Item 1', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc"},
        {_id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
        {_id: "3", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
        {_id: "4", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
        {_id: "5", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"}
      ]
    }
  ]);
  const { id } = useParams();
  const [_, setBundle] = useRecoilState<Bundle>(bundleAtom);
  const [displayedBundles, setDisplayedBundles] = useState<Bundle[]>(bundles);
  const navigate = useNavigate();
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

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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