import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';


function Bundles() {

  const { t } = useTranslation('translation', { keyPrefix: 'Bundles' });
  const navigate = useNavigate();

  const goToNewBundle = () => {
    navigate('/bundles/new');
  }

  return (
    <main>
      <Header title={t('bundles')} buttonTitle={t('newBundle')} buttonClick={goToNewBundle} />
    </main>
  )
}

export default Bundles