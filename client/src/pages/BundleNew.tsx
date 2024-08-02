import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, ThemeProvider, useTheme } from '@mui/material';
import ItemsList from '../components/ItemsList/ItemsList';
import GlassButton from '../components/GlassButton/GlassButton';
import { MdAdd } from 'react-icons/md';
import formTheme from '../themes/formTheme';
import { useRecoilState } from 'recoil';
import { bundleAtom } from '../recoil/atoms';
import Bundle from '../interface/BundleInterface';
import { useState } from 'react';
import Loading from '../components/Loading/Loading';
import Cookies from 'universal-cookie';
import { post } from '../utils/apiRequest';
import { toast } from 'react-toastify';

function BundleNew() {

  const { t } = useTranslation('translation', { keyPrefix: 'BundleNew' });
  const navigate = useNavigate();
  const [bundle, setBundle] = useRecoilState<Bundle>(bundleAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cookies = new Cookies();

  const outerTheme = useTheme();

  const goToBundles = () => {
    setBundle({_id: "", title: '', items: []});
    navigate('/bundles');
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBundle({...bundle, title: e.target.value});
  }

  const onItemClicked = (id: string) => {
    navigate(`/bundles/new/item/${id}`);
  }

  const onSwipedRight = (id: string) => {
    setBundle((prevBundle) => ({
      ...prevBundle,
      items: prevBundle.items.filter(item => item._id !== id)
    }));
  }

  const selectItem = () => {
    navigate(`/bundles/new/items`);
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
      items: bundle.items.map(item => item._id)
    }
    await post('/api/bundle', formData, (_) => {
      setBundle({_id: "", title: '', items: []});
      navigate('/bundles');
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    });
    setIsLoading(false);
  }

  if (isLoading) {
    return <Loading />; 
  }

  return (
    <main>
      <Header title={t('newBundle')} onBack={goToBundles} />
      <form className='list-form' onSubmit={onSubmit}>
        <ThemeProvider theme={formTheme(outerTheme)}>
        <TextField required name="title" color='success' className='white-color-input' fullWidth value={bundle.title} label={t('title')} onChange={onChange} variant="outlined" />
          <ItemsList onItemClicked={onItemClicked} items={bundle.items} onSwipeRight={onSwipedRight} />
          <Button onClick={selectItem} variant='outlined' color='success'>{t('addItem')}</Button>
          <GlassButton endIcon={<MdAdd size={"1.5rem"} color='white'/>} text={t('create')} style={{width: "100%", color: "white"}} type="submit"/>
        </ThemeProvider>
      </form>
    </main>
  )
}

export default BundleNew