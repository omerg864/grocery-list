import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import Loading from '../components/Loading/Loading';
import { get } from '../utils/apiRequest';
import { toast } from 'react-toastify';

function VerifyEmail() {

    const { t } = useTranslation('translation', { keyPrefix: 'VerifyEmail' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { token } = useParams();
    const [message, setMessage] = useState<string>('verifying');


    const verifyEmail = async () => {
        setIsLoading(true);
        await get(`/api/user/verify/${token}`, (data) => {
            if (data.message === 'verified') {
                setMessage('emailVerified');
                toast.success(t('emailVerified'));
                navigate('/');
            } else {
                setMessage(data.message);
                toast.error(t(data.message));
            }
        }, {}, (_) => {
            setMessage('notVerified');
        });
        setIsLoading(false);
    }

    useEffect(() => {
        verifyEmail();
    }, []);

    const back = () => {
        navigate('/');
    }

    if(isLoading) {
        return <Loading />
    }


  return (
    <main style={{textAlign: 'center'}}>
        <Header title={t('verifyEmail')} onBack={back}/>
        <div className='list-form'>
            <Typography>
                {t(message)}
            </Typography>
            {message === 'notVerified' && <Link to={'/verify/send'}>{t('clickHereToSendAgain')}</Link>}
        </div>
    </main>
  )
}

export default VerifyEmail