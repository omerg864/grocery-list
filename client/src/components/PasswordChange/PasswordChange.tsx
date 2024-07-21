import { TextField, ThemeProvider, useTheme } from '@mui/material';
import React, { Fragment, useState } from 'react';
import formTheme from '../../themes/formTheme';
import PasswordRules from '../PasswordRules/PasswordRules';
import GlassButton from '../GlassButton/GlassButton';
import { MdLockReset } from 'react-icons/md';
import { useTranslation } from 'react-i18next';


interface PasswordChangeProps {
  setTab: (tab: number) => void;
  setIsLoading: (loading: boolean) => void;
}

function PasswordChange(props: PasswordChangeProps) {
  const outerTheme = useTheme();
  const [form, setForm] = useState<{password: string, password2: string}>({password: '', password2: ''});
  const { t } = useTranslation('translation', { keyPrefix: 'ResetPassword' });

  const resetPassword = () => {
    props.setIsLoading(true);
    setTimeout(() => {
      props.setIsLoading(false);
      props.setTab(0);
    }, 1000);
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  return (
    <Fragment>
      <form style={{display: 'flex', flexDirection: 'column', gap: '10px'}} onSubmit={resetPassword}>
        <ThemeProvider theme={formTheme(outerTheme)}>
          <TextField name="password" required type="password" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.password} label={t('password')} variant="outlined" />
          <PasswordRules color='white'/>
          <TextField name="password2" required type="password" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.password2} label={t('confirmPassword')} variant="outlined" />
          <GlassButton endIcon={<MdLockReset size={"1.5rem"} color='white'/>} text={t('resetPassword')} style={{width: "100%", color: "white"}} type='submit'/>
        </ThemeProvider>
      </form>
    </Fragment>
  )
}

export default PasswordChange