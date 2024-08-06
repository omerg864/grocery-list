import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useEffect, useState } from 'react';
import Bundle, { bundleDefault } from '../interface/BundleInterface';
import ItemsList from '../components/ItemsList/ItemsList';
import Loading from '../components/Loading/Loading';
import { Button, TextareaAutosize, TextField, ThemeProvider, useTheme } from '@mui/material';
import formTheme from '../themes/formTheme';
import { useTranslation } from 'react-i18next';
import GlassButton from '../components/GlassButton/GlassButton';
import { HiOutlineSave } from 'react-icons/hi';
import { useRecoilState } from 'recoil';
import { bundleAtom, bundlesAtom } from '../recoil/atoms';
import { get, put } from '../utils/apiRequest';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';



function BundleEdit() {

  const { t } = useTranslation('translation', { keyPrefix: 'BundleEdit' });
  const navigate = useNavigate();
  const [bundle, setBundle] = useRecoilState<Bundle>(bundleAtom);
  const [_, setBundles] = useRecoilState<Bundle[]>(bundlesAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();
  const cookies = new Cookies();

  const outerTheme = useTheme();

  const back = () => {
    setBundle(bundleDefault);
    navigate(`/bundles/${bundle._id}`);
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBundle({...bundle, [e.target.name]: e.target.value});
  }

  const onSwipedRight = (id: string) => {
    setBundle((prevBundle) => ({
      ...prevBundle,
      items: prevBundle.items.filter(item => item._id !== id)
    }));
  }

  const selectItem = () => {
    navigate(`/bundles/${bundle._id}/edit/items`);
  }

  const onItemClicked = (id: string) => {
    navigate(`/bundles/${bundle._id}/edit/item/${id}`);
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bundle.title) {
      toast.error(t('titleRequired'));
      return;
    }
    if (bundle.items.length === 0) {
      toast.error(t('itemsRequired'));
      return;
    }
    setIsLoading(true);
    let formData = {
      title: bundle.title,
      items: bundle.items.map(item => item._id),
      description: bundle.description,
    }
    await put(`/api/bundle/${id}`, formData, (_) => {
      setBundle(bundleDefault);
      setBundles([]);
      navigate('/bundles');
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    });
    setIsLoading(false);
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
    if (!bundle._id || bundle._id !== id) {
      getBundle();
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <Header title={bundle.title} onBack={back} />
      <form className='list-form' onSubmit={onSubmit}>
        <ThemeProvider theme={formTheme(outerTheme)}>
        <TextField required name="title" color='success' className='white-color-input' fullWidth value={bundle.title} label={t('title')} onChange={onChange} variant="outlined" />
        <TextareaAutosize minRows={2} placeholder={t('description')} name="description" value={bundle.description} onChange={onChange} />
          <ItemsList onItemClicked={onItemClicked} items={bundle.items} onSwipeRight={onSwipedRight} />
          <Button onClick={selectItem} variant='outlined' color='success'>{t('addItem')}</Button>
          <GlassButton endIcon={<HiOutlineSave size={"1.5rem"} color='white'/>} text={t('save')} style={{width: "100%", color: "white"}} type="submit"/>
        </ThemeProvider>
      </form>
    </main>
  )
}

export default BundleEdit