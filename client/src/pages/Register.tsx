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
import PasswordRules from '../components/PasswordRules/PasswordRules';
import Loading from '../components/Loading/Loading';
import { email_regex, password_regex } from '../utils/regex';
import { toast } from 'react-toastify';
import { post } from '../utils/apiRequest';
import { motion } from 'framer-motion';

function Register() {
  const { t } = useTranslation('translation', { keyPrefix: 'Register' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<Omit<User & {password2: string, email: string, password: string}, '_id' | 'avatar'>>({email: '', password: '', password2: '', f_name: '', l_name: ''});

  const outerTheme = useTheme();

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if(form.password !== form.password2) {
      setIsLoading(false);
      toast.error(t('passwordsDontMatch'));
      return;
    }
    if(!email_regex.test(form.email)) {
      setIsLoading(false);
      toast.error(t('invalidEmail'));
      return;
    }
    if(!password_regex.test(form.password)) {
      setIsLoading(false);
      toast.error(t('invalidPassword'));
      return;
    }
    await post('/api/user/register', form, (_) => {
      toast.success(t('pleaseVerify'));
      navigate('/login');
    });
  }

  const goToLogin = () => {
    navigate('/login');
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  if (isLoading) {
    return <Loading />;
  }


  return (
    <main>
    <Header title={t('register')} buttonClick={goToLogin} buttonTitle={t('haveAccount')} endIcon={<CiLogin size={"1.5rem"} color='black'/>}  />
    <motion.form animate={{scale: [0, 1]}} transition={{ duration: 0.4}}  className='list-form' onSubmit={register}>
      <ThemeProvider theme={formTheme(outerTheme)}>
        <TextField name="f_name" required  color='success' className='white-color-input' fullWidth onChange={onChange} value={form.f_name} label={t('firstName')} variant="outlined" />
        <TextField name="l_name" required color='success' className='white-color-input' fullWidth onChange={onChange} value={form.l_name} label={t('lastName')} variant="outlined" />
        <TextField name="email" required type="email" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.email} label={t('email')} variant="outlined" />
        <TextField name="password" required type="password" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.password} label={t('password')} variant="outlined" />
        <PasswordRules color='white'/>
        <TextField name="password2" required type="password" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.password2} label={t('confirmPassword')} variant="outlined" />
        <GlassButton endIcon={<FiUserPlus size={"1.5rem"} color='white'/>} text={t('register')} style={{width: "100%", color: "white"}} type='submit'/>
      </ThemeProvider>
    </motion.form>
  </main>
  )
}

export default Register