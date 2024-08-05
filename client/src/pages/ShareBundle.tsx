import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import { FormEvent, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { get, post } from '../utils/apiRequest';
import Loading from '../components/Loading/Loading';
import { bundlesAtom } from '../recoil/atoms';
import { useRecoilState } from 'recoil';
import GlassButton from '../components/GlassButton/GlassButton';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Bundle, { bundleDefault } from '../interface/BundleInterface';
import { IoMdAdd } from 'react-icons/io';
import { TextareaAutosize, Typography } from '@mui/material';
import ItemsList from '../components/ItemsList/ItemsList';

function ShareBundle() {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState<Bundle>(bundleDefault);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_, setBundles] = useRecoilState<Bundle[]>(bundlesAtom);
  const cookies = new Cookies();
  const { t } = useTranslation('translation', { keyPrefix: 'ShareBundle' });


  const getBundle = async () => {
    setIsLoading(true);
    await get(`/api/bundle/${id}`, (data) => {
      setBundle(data.bundle);
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    })
    setIsLoading(false);
  }

  const copyBundle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await post(`/api/bundle/${id}/share`, {}, (_) => {
      setBundles([]);
      toast.success(t('bundleAdded'));
      navigate(`/bundles`);
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    })
    setIsLoading(false);
  }

  const back = () => {
    navigate('/bundles');
  }


  useEffect(() => {
    getBundle();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }


  return (
    <main>
      <Header title={bundle.title} onBack={back} />
      <form className="list-form" onSubmit={copyBundle}>
        <TextareaAutosize minRows={3} placeholder={t('description')} name="description" value={bundle.description} disabled={true} />
        <Typography variant="h5">{t('items')}</Typography>
        <ItemsList items={bundle.items} />
        <GlassButton endIcon={<IoMdAdd size={"1.5rem"} color='white'/>} text={t('addToBundles')} style={{width: "100%", color: "white"}} type="submit"/>
      </form>
    </main>
  )
}

export default ShareBundle