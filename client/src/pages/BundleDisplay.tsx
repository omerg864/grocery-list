import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useEffect, useState } from 'react';
import Bundle, { bundleDefault } from '../interface/BundleInterface';
import ItemsList from '../components/ItemsList/ItemsList';
import Loading from '../components/Loading/Loading';
import { IconButton, TextareaAutosize, Typography } from '@mui/material';
import { MdModeEditOutline } from 'react-icons/md';
import { useRecoilState } from 'recoil';
import { bundleAtom } from '../recoil/atoms';
import { get } from '../utils/apiRequest';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { IoIosShare } from 'react-icons/io';



function BundleDisplay() {

  const navigate = useNavigate();
  const [bundle, setBundle] = useState<Bundle>(bundleDefault);
  const [_, setBundleState] = useRecoilState<Bundle>(bundleAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation('translation', { keyPrefix: 'BundleDisplay' });
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

  const shareBundle = () => {
    if (navigator.share) {
          navigator.share({
            title: t('shareTitle'),
            text: t('shareText'),
            url: `${import.meta.env.VITE_HOST_URL}/share/bundle/${bundle._id}`, // Replace with your link
          });
      } else {
        toast.info(t('linkCopied'));
        navigator.clipboard.writeText(`${import.meta.env.VITE_HOST_URL}/share/bundle/${bundle._id}`); // Replace with your link
      }
  }

  useEffect(() => {
    getBundle();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <Header title={bundle.title} onBack={goToBundles} endIcon={<IoIosShare size={"1.5rem"} color="black" />} buttonClick={shareBundle} buttonTitle={t('shareBundle')} sideButton={<IconButton onClick={edit}>
        <MdModeEditOutline color="white"/>
      </IconButton>} />
      <div className='list-form'>
        <TextareaAutosize placeholder={t('description')} minRows={3} name="description" value={bundle.description} disabled={true} />
        <Typography variant="h5">{t('items')}</Typography>
        <ItemsList onItemClicked={onItemClicked} items={bundle.items} />
      </div>
    </main>
  )
}

export default BundleDisplay