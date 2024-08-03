import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import formTheme from '../themes/formTheme';
import { TextField, ThemeProvider, useTheme } from '@mui/material';
import GlassButton from '../components/GlassButton/GlassButton';
import { MdLockReset } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import Loading from '../components/Loading/Loading';
import { post } from '../utils/apiRequest';
import { toast } from 'react-toastify';
import { email_regex } from '../utils/regex';

function ForgotPassword() {
    const { t } = useTranslation('translation', { keyPrefix: 'ForgotPassword' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');

    const outerTheme = useTheme();


    const goToLogin = () => {
        navigate('/login');
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const resetRequest = async () => {
        if (!email) {
            toast.error(t('emailRequired'));
            return;
        }
        if (!email_regex.test(email)) {
            toast.error(t('emailInvalid'));
            return;
        }
        setIsLoading(true);
        await post(`/api/user/reset-password/email`, { email }, (_) => {
            toast.success(t('emailSent'));
            navigate('/login');
        });
        setIsLoading(false);
    }

    if (isLoading) {
        return <Loading />;
    }
  return (
    <main>
        <Header title={t('resetPasswordRequest')} buttonTitle={t('rememberPassword')} endIcon={<CiLogin size={"1.5rem"} color='black'/>} buttonClick={goToLogin} />
        <form className='list-form' onSubmit={resetRequest}>
        <ThemeProvider theme={formTheme(outerTheme)}>
            <TextField name="email" required type="email" color='success' className='white-color-input' fullWidth onChange={onChange} value={email} label={t('email')} variant="outlined" />
            <GlassButton type='submit' endIcon={<MdLockReset size={"1.5rem"} color='white'/>} text={t('sendEmail')} style={{width: "100%", color: "white"}} />
        </ThemeProvider>
        </form>
    </main>
  )
}

export default ForgotPassword