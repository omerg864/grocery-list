import { useTranslation } from "react-i18next";
import Header from "../components/Header/Header";
import { useState } from "react";
import { IconButton, TextField, ThemeProvider, Tooltip, useTheme } from "@mui/material";
import { FiUserPlus } from "react-icons/fi";
import { CiLogin } from "react-icons/ci";
import { useNavigate, useSearchParams } from "react-router-dom";
import formTheme from "../themes/formTheme";
import GlassButton from "../components/GlassButton/GlassButton";
import { MdLockReset } from "react-icons/md";
import Cookies from "universal-cookie";
import { addDays } from "../utils/functions";
import Loading from "../components/Loading/Loading";
import { post } from "../utils/apiRequest";
import { toast } from "react-toastify";
import GoogleLogin from "../components/GoogleLogin/GoogleLogin";
import i18next from 'i18next';


interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

function Login(props: LoginProps) {

  const { t } = useTranslation('translation', { keyPrefix: 'Login' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<{email: string, password: string}>({email: '', password: ''});
  const cookies = new Cookies();
  const [searchParams] = useSearchParams();

  const outerTheme = useTheme();

  const successfulLogin = (data: any) => {
    let date30 = addDays(new Date(), 30);
    cookies.set('userToken', data.token, { path: '/', secure: true, expires: date30 });
    cookies.set('user', JSON.stringify(data.user), { path: '/', secure: true, expires: date30 });
    i18next.changeLanguage(data.user.language);
    props.setIsAuthenticated(true);
    navigate(searchParams.get('redirect') ? `/${searchParams.get('redirect')}` : '/');
  }

  const login = async () => {
    setIsLoading(true);
    await post('/api/user/login', form, (data) => {
      successfulLogin(data);
    }, {}, (message) => {
      if (message === 'Please verify your email') {
        toast.error(t('verifyEmailResend'));
        navigate('/verify-email');
      } else {
        toast.error(message);
      }
    });
    setIsLoading(false);
  }

  const responseGoogle = async (authResult: any) => {
    if (authResult["code"]) {
      setIsLoading(true);
      await post(`/api/user/google`, {
        code: authResult.code,
      } , (data) => {
        if (data.reset) {
          toast.info(t('resetPasswordToLogin'));
        }
        successfulLogin(data);
      });
      setIsLoading(false);
    } else {
      console.log(authResult);
      throw new Error(authResult);
    }
	};

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
          <GoogleLogin authResponse={responseGoogle}/>
      </ThemeProvider>
    </form>
    </main>
  )
}

export default Login