import { useTranslation } from 'react-i18next';
import Header from '../components/Header/Header'
import { useNavigate } from 'react-router-dom';
import { TextField, ThemeProvider, useTheme } from '@mui/material';
import formTheme from '../themes/formTheme';
import { useState } from 'react';
import GlassButton from '../components/GlassButton/GlassButton';
import { IoMdSend } from "react-icons/io";

function VerifyEmailResend() {

    const { t } = useTranslation('translation', { keyPrefix: 'VerifyEmailResend' });
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');

    const outerTheme = useTheme();

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Send email
    }


    const back = () => {
        navigate('/login');
    }

  return (
    <main>
        <Header title={t('verifyEmailResend')} onBack={back} />
        <form className='list-form' onSubmit={submit}>
            <ThemeProvider theme={formTheme(outerTheme)}>
                <TextField required name="email" type='email' color='success' className='white-color-input' fullWidth onChange={onChange} value={email} label={t('email')} variant="outlined" />
            </ThemeProvider>
            <GlassButton endIcon={<IoMdSend size={"1.5rem"} color='white'/>} text={t('send')} style={{width: "100%", color: "white"}} type="submit"/>
        </form>
    </main>
  )
}

export default VerifyEmailResend