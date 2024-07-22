import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useState } from 'react';
import Bundle from '../interface/BundleInterface';
import ItemsList from '../components/ItemsList/ItemsList';
import Loading from '../components/Loading/Loading';
import { Button, TextField, ThemeProvider, useTheme } from '@mui/material';
import formTheme from '../themes/formTheme';
import { useTranslation } from 'react-i18next';
import GlassButton from '../components/GlassButton/GlassButton';
import { HiOutlineSave } from 'react-icons/hi';



function BundleEdit() {

  const { t } = useTranslation('translation', { keyPrefix: 'BundleEdit' });
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

  const outerTheme = useTheme();

  const back = () => {
    navigate(`/bundles/${bundle.id}`);
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBundle({...bundle, title: e.target.value});
  }

  const onSwipedRight = (id: string) => {
    setBundle((prevBundle) => ({
      ...prevBundle,
      items: prevBundle.items.filter(item => item.id !== id)
    }));
  }

  const selectItem = () => {
    navigate(`/bundles/${bundle.id}/items`);
  }

  const onItemClicked = (id: string) => {
    navigate(`/bundles/${bundle.id}/edit/item/${id}`);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <Header title={bundle.title} onBack={back} />
      <div className='list-form'>
        <ThemeProvider theme={formTheme(outerTheme)}>
        <TextField name="category" color='success' className='white-color-input' fullWidth value={bundle.title} label={t('title')} onChange={onChange} variant="outlined" />
          <ItemsList onItemClicked={onItemClicked} items={bundle.items} onSwipeRight={onSwipedRight} />
          <Button onClick={selectItem} variant='outlined' color='success'>{t('addItem')}</Button>
          <GlassButton endIcon={<HiOutlineSave size={"1.5rem"} color='white'/>} text={t('save')} style={{width: "100%", color: "white"}} type="submit"/>
        </ThemeProvider>
      </div>
    </main>
  )
}

export default BundleEdit