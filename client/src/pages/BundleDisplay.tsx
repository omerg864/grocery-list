import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useState } from 'react';
import Bundle from '../interface/BundleInterface';
import ItemsList from '../components/ItemsList/ItemsList';
import Loading from '../components/Loading/Loading';
import { IconButton } from '@mui/material';
import { MdModeEditOutline } from 'react-icons/md';



function BundleDisplay() {

  const navigate = useNavigate();
  const [bundle, setBundle] = useState<Bundle>({
    id: "1",
    title: 'Bundle 1',
    items: [
      {id: "1", name: 'Item 1', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc"},
      {id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"}
    ]
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const goToBundles = () => {
    navigate('/bundles');
  }

  const edit = () => {
    navigate(`/bundles/${bundle.id}/edit`);
  }

  const onItemClicked = (id: string) => {
    navigate(`/bundles/${bundle.id}/item/${id}`);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <Header title={bundle.title} onBack={goToBundles} sideButton={<IconButton onClick={edit}>
        <MdModeEditOutline color="white"/>
      </IconButton>} />
      <div className='list-form'>
        <ItemsList onItemClicked={onItemClicked} items={bundle.items} />
      </div>
    </main>
  )
}

export default BundleDisplay