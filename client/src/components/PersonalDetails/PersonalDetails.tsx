import { TextField } from '@mui/material';
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next';
import GlassButton from '../GlassButton/GlassButton';
import { RxUpdate } from "react-icons/rx";


interface PersonalDetailsProps {
  setTab: (tab: number) => void;
  setIsLoading: (loading: boolean) => void;
}
function PersonalDetails(props: PersonalDetailsProps) {

  const { t } = useTranslation('translation', { keyPrefix: 'Profile' });
  // TODO: get user details
  const [form, setForm] = useState<{f_name: string, l_name: string, email: string}>({f_name: '', l_name: '', email: ''});

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  const changeDetails = async () => {
    props.setIsLoading(true);
    setTimeout(() => {
      props.setIsLoading(false);
      props.setTab(0);
    }, 1000);
  }

  return (
    <Fragment>
      <form style={{display: 'flex', flexDirection: 'column', gap: '10px'}} onSubmit={changeDetails}>
        <TextField name="f_name" required  color='success' className='white-color-input' fullWidth onChange={onChange} value={form.f_name} label={t('firstName')} variant="outlined" />
        <TextField name="l_name" required color='success' className='white-color-input' fullWidth onChange={onChange} value={form.l_name} label={t('lastName')} variant="outlined" />
        <TextField name="email" required type="email" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.email} label={t('email')} variant="outlined" />
        <GlassButton endIcon={<RxUpdate size={"1.5rem"} color='white'/>} text={t('update')} style={{width: "100%", color: "white"}} type='submit'/>
      </form>
    </Fragment>
  )
}

export default PersonalDetails