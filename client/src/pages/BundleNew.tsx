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

function BundleNew() {

  const { t } = useTranslation('translation', { keyPrefix: 'BundleNew' });
  const navigate = useNavigate();
  const [bundle, setBundle] = useRecoilState<Bundle>(bundleAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const outerTheme = useTheme();

  const goToBundles = () => {
    setBundle({id: "", title: '', items: []});
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setBundle({id: "", title: '', items: []});
      navigate('/bundles');
    }, 1000);
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