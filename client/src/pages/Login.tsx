import { useTranslation } from "react-i18next";
import Header from "../components/Header/Header";
import { useState } from "react";
import { IconButton, TextField, ThemeProvider, useTheme } from "@mui/material";
import { FiUserPlus } from "react-icons/fi";
import { CiLogin } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import formTheme from "../themes/formTheme";
import GlassButton from "../components/GlassButton/GlassButton";
import { MdLockReset } from "react-icons/md";

function Login() {

  const { t } = useTranslation('translation', { keyPrefix: 'Login' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<{email: string, password: string}>({email: '', password: ''});

  const outerTheme = useTheme();

  const login = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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

  return (
    <main>
      <Header title={t('login')} buttonClick={goToRegister} buttonTitle={t('noAccount')} endIcon={<FiUserPlus size={"1.5rem"} color='black'/>} sideButton={<IconButton onClick={goToForgotPassword}><MdLockReset color="white"/></IconButton>} />
      <form className='list-form' >
      <ThemeProvider theme={formTheme(outerTheme)}>
          <TextField name="email" required type="email" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.email} label={t('email')} variant="outlined" />
          <TextField name="password" required type="password" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.password} label={t('password')} variant="outlined" />
          <GlassButton endIcon={<CiLogin size={"1.5rem"} color='white'/>} text={t('login')} style={{width: "100%", color: "white"}} onClick={login}/>
      </ThemeProvider>
    </form>
    </main>
  )
}

export default Login