import { TextField, ThemeProvider, useTheme } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi';
import Header from '../components/Header/Header';
import formTheme from '../themes/formTheme';
import GlassButton from '../components/GlassButton/GlassButton';
import { CiLogin } from "react-icons/ci";
import User from '../interface/UserInterface';

function Register() {
  const { t } = useTranslation('translation', { keyPrefix: 'Register' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<User & {password2: string}>({email: '', password: '', password2: '', f_name: '', l_name: '', avatar: '', id: ''});

  const outerTheme = useTheme();

  const register = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  const goToLogin = () => {
    navigate('/login');
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }


  return (
    <main>
    <Header title={t('register')} buttonClick={goToLogin} buttonTitle={t('haveAccount')} endIcon={<CiLogin size={"1.5rem"} color='black'/>}  />
      <form className='list-form' >
      <ThemeProvider theme={formTheme(outerTheme)}>
        <TextField name="f_name" required  color='success' className='white-color-input' fullWidth onChange={onChange} value={form.f_name} label={t('firstName')} variant="outlined" />
        <TextField name="l_name" required color='success' className='white-color-input' fullWidth onChange={onChange} value={form.l_name} label={t('lastName')} variant="outlined" />
        <TextField name="email" required type="email" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.email} label={t('email')} variant="outlined" />
        <TextField name="password" required type="password" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.password} label={t('password')} variant="outlined" />
        <TextField name="password2" required type="password" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.password} label={t('confirmPassword')} variant="outlined" />
        <GlassButton endIcon={<FiUserPlus size={"1.5rem"} color='white'/>} text={t('register')} style={{width: "100%", color: "white"}} onClick={register}/>
      </ThemeProvider>
    </form>
  </main>
  )
}

export default Register