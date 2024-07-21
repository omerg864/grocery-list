import React, { useState } from 'react'
import Header from '../components/Header/Header';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

function SelectItem() {

    const { t } = useTranslation('translation', { keyPrefix: 'SelectItem' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();

    const backClick = () => {
        navigate(`/lists/${id}`);
    }

  return (
    <main>
        <Header title={t('selectItem')} onBack={backClick} />
    </main>
  )
}

export default SelectItem