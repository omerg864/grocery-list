import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

function Page404() {

    const { t } = useTranslation('translation', { keyPrefix: 'Page404' });
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    }

  return (
    <main style={{textAlign: 'center'}}>
        <Header title={t('notFound')} onBack={handleBack} />
        <Typography variant='h6' style={{padding: '1rem'}}>{t('pageNotFound')}</Typography>
    </main>
  )
}

export default Page404