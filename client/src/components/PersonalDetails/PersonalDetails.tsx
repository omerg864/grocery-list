import { Avatar, IconButton, TextField, ThemeProvider, useTheme } from '@mui/material';
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next';
import GlassButton from '../GlassButton/GlassButton';
import { RxUpdate } from "react-icons/rx";
import { MdEdit } from 'react-icons/md';
import formTheme from '../../themes/formTheme';


interface PersonalDetailsProps {
  setTab: (tab: number) => void;
  setIsLoading: (loading: boolean) => void;
}
function PersonalDetails(props: PersonalDetailsProps) {

  const { t } = useTranslation('translation', { keyPrefix: 'Profile' });
  // TODO: get user details
  const [form, setForm] = useState<{f_name: string, l_name: string, email: string, img: string}>({f_name: 'omer', l_name: 'gai', email: '', img: ''});
  const [img, setImg] = useState<string | null>(null);

  const outerTheme = useTheme();

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

  const onImgClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    let image = e.target as HTMLImageElement;
    let imageCopy = image.cloneNode() as HTMLImageElement;
    imageCopy.style.width = '100%';
    imageCopy.style.height = 'auto';
    imageCopy.style.borderRadius = '0';
    let newDiv = document.createElement('div');
    newDiv.style.position = 'fixed';
    newDiv.style.top = '0';
    newDiv.style.left = '0';
    newDiv.style.width = '100%';
    newDiv.style.height = '100%';
    newDiv.style.background = 'rgba(0, 0, 0, 0.8)';
    newDiv.style.display = 'flex';
    newDiv.style.alignItems = 'center';
    newDiv.style.justifyContent = 'center';
    newDiv.appendChild(imageCopy);
    document.body.appendChild(newDiv);
    newDiv.addEventListener('click', () => {
        newDiv.remove();
    });
  }

  const onImgIconClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setImg(URL.createObjectURL(files[0]));
      }
    }
  }

  return (
    <Fragment>
      <ThemeProvider theme={formTheme(outerTheme)}>
      <form style={{display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '5.5rem', position: 'relative'}} onSubmit={changeDetails}>
      <div className="item-display-img-container">
            {form.img ? <img onClick={onImgClick} className='item-display-img' src={form.img} alt={form.f_name} /> : <Avatar sx={{width: '10rem', height: '10rem', fontSize: '3.5rem'}} className='item-display-img'>
              {form.f_name.charAt(0).toUpperCase() + form.l_name.charAt(0).toUpperCase()}
              </Avatar>}
            <IconButton onClick={onImgIconClick} style={{
                position: 'absolute',
                bottom: 'calc(50% - 1rem)',
                background: 'var(--color-primary)',
                right: '-1rem',
                width: '2rem',
                height: '2rem'
            }} aria-label="fingerprint" color="success">
                    <MdEdit color="black" />
            </IconButton>
        </div>
        <TextField name="f_name" required  color='success' className='white-color-input' fullWidth onChange={onChange} value={form.f_name} label={t('firstName')} variant="outlined" />
        <TextField name="l_name" required color='success' className='white-color-input' fullWidth onChange={onChange} value={form.l_name} label={t('lastName')} variant="outlined" />
        <TextField name="email" required type="email" color='success' className='white-color-input' fullWidth onChange={onChange} value={form.email} label={t('email')} variant="outlined" />
        <GlassButton endIcon={<RxUpdate size={"1.5rem"} color='white'/>} text={t('update')} style={{width: "100%", color: "white"}} type='submit'/>
      </form>
      </ThemeProvider>
    </Fragment>
  )
}

export default PersonalDetails