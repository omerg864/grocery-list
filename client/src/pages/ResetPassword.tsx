import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import Header from '../components/Header/Header';
import { TextField, ThemeProvider, useTheme } from '@mui/material';
import formTheme from '../themes/formTheme';
import GlassButton from '../components/GlassButton/GlassButton';
import PasswordRules from '../components/PasswordRules/PasswordRules';
import { MdLockReset } from "react-icons/md";

function ResetPassword() {
  const { t } = useTranslation('translation', { keyPrefix: 'ResetPassword' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<{password: string, password2: string}>({password: '', password2: ''});

  let { token } = useParams();

  const outerTheme = useTheme();

  const resetPassword = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1000);
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  
  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <Header title={t('resetPassword')} />
      <form className='list-form' onSubmit={resetPassword}>
        <ThemeProvider theme={formTheme(outerTheme)}>
          <TextField name="password" required type="password" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.password} label={t('password')} variant="outlined" />
          <PasswordRules color='white'/>
          <TextField name="password2" required type="password" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.password2} label={t('confirmPassword')} variant="outlined" />
          <GlassButton endIcon={<MdLockReset size={"1.5rem"} color='white'/>} text={t('resetPassword')} style={{width: "100%", color: "white"}} type='submit'/>
        </ThemeProvider>
      </form>
    </main>
  )
}

export default ResetPassword