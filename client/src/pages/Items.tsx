import React from 'react'
import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';

function Items() {

  const { t } = useTranslation('translation', { keyPrefix: 'Items' });
  const navigate = useNavigate();

  const goToNewItem = () => {
    navigate('/items/new');
  }
  return (
    <main>
    <Header title={t('items')} buttonClick={goToNewItem} buttonTitle={t('newItem')} />
  </main>
  )
}

export default Items