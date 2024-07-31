import { useTranslation } from "react-i18next";
import Header from "../components/Header/Header";
import { useState } from "react";
import { IconButton, TextField, ThemeProvider, Tooltip, useTheme } from "@mui/material";
import { FiUserPlus } from "react-icons/fi";
import { CiLogin } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import formTheme from "../themes/formTheme";
import GlassButton from "../components/GlassButton/GlassButton";
import { MdLockReset } from "react-icons/md";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { addDays } from "../utils/functions";
import Loading from "../components/Loading/Loading";
import axios from "axios";
import { post } from "../utils/apiRequest";


interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

function Login(props: LoginProps) {

  const { t } = useTranslation('translation', { keyPrefix: 'Login' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<{email: string, password: string}>({email: '', password: ''});
  const cookies = new Cookies();

  const outerTheme = useTheme();

  const login = async () => {
    setIsLoading(true);
    await post('/api/user/login', form, (data) => {
      let date30 = addDays(new Date(), 30);
      cookies.set('userToken', data.token, { path: '/', secure: true, expires: date30 });
      cookies.set('user', JSON.stringify(data.user), { path: '/', secure: true, expires: date30 });
      props.setIsAuthenticated(true);
      navigate('/');
    });
    setIsLoading(false);
  }

  const goToRegister = () => {
    navigate('/register');
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  const goToForgotPassword = () => {
    navigate('/forgot-password');
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <Header title={t('login')} buttonClick={goToRegister} buttonTitle={t('noAccount')} endIcon={<FiUserPlus size={"1.5rem"} color='black'/>} sideButton={<Tooltip title={t('forgotPassword')}><IconButton onClick={goToForgotPassword}><MdLockReset color="white"/></IconButton></Tooltip>} />
      <form className='list-form' onSubmit={login} >
      <ThemeProvider theme={formTheme(outerTheme)}>
          <TextField name="email" required type="email" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.email} label={t('email')} variant="outlined" />
          <TextField name="password" required type="password" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.password} label={t('password')} variant="outlined" />
          <GlassButton endIcon={<CiLogin size={"1.5rem"} color='white'/>} text={t('login')} style={{width: "100%", color: "white"}} type="submit"/>
      </ThemeProvider>
    </form>
    </main>
  )
}

export default Login