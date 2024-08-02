import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useEffect, useState } from 'react';
import Bundle from '../interface/BundleInterface';
import ItemsList from '../components/ItemsList/ItemsList';
import Loading from '../components/Loading/Loading';
import { IconButton } from '@mui/material';
import { MdModeEditOutline } from 'react-icons/md';
import { useRecoilState } from 'recoil';
import { bundleAtom } from '../recoil/atoms';
import { get } from '../utils/apiRequest';
import Cookies from 'universal-cookie';



function BundleDisplay() {

  const navigate = useNavigate();
  const [bundle, setBundle] = useState<Bundle>({
    _id: "",
    title: '',
    items: []
  });
  const [_, setBundleState] = useRecoilState<Bundle>(bundleAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();
  const cookies = new Cookies();

  const goToBundles = () => {
    navigate('/bundles');
  }

  const edit = () => {
    setBundleState(bundle);
    navigate(`/bundles/${bundle._id}/edit`);
  }

  const onItemClicked = (id: string) => {
    navigate(`/bundles/${bundle._id}/item/${id}`);
  }

  const getBundle = async () => {
    setIsLoading(true);
    await get(`/api/bundle/${id}`, (data) => {
      setBundle(data.bundle);
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`
    });
    setIsLoading(false);
  }

  useEffect(() => {
    getBundle();
  }, []);

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