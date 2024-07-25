import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, ThemeProvider, useTheme } from '@mui/material';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAddCircleSharp } from "react-icons/io5";
import { CiCircleMinus } from "react-icons/ci";
import i18next from 'i18next';
import GlassButton from '../GlassButton/GlassButton';
import { GiSettingsKnobs } from "react-icons/gi";
import formTheme from '../../themes/formTheme';


interface PreferencesProps {
    setTab: (tab: number) => void;
    setIsLoading: (loading: boolean) => void;
}

function Preferences(props: PreferencesProps) {

  const { t } = useTranslation('translation', { keyPrefix: 'Profile' });

  const [form, setForm] = useState<{fullSwipe: boolean, language: string}>({fullSwipe: false, language: 'en'});

  const outerTheme = useTheme();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  const onChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.checked });
  }

  const onSelectChange = (event: SelectChangeEvent) => {
    setForm({ ...form, language: event.target.value as string});
  };

  const changePreferences = async () => {
    props.setIsLoading(true);
    setTimeout(() => {
      props.setIsLoading(false);
      // change language
      if (form.language === 'he') {
        document.body.dir = 'rtl';
      } else {
        document.body.dir = 'ltr';
      }
      i18next.changeLanguage(form.language);
      props.setTab(0);
    }, 1000);
  }

  return (
    <Fragment>
      <form style={{display: 'flex', flexDirection: 'column', gap: '10px'}} onSubmit={changePreferences}>
        <ThemeProvider theme={formTheme(outerTheme)}>
      <FormControlLabel control={<Checkbox name="fullSwipe" onChange={onChecked} checked={form.fullSwipe} color="success" icon={<CiCircleMinus color='white' />} checkedIcon={<IoAddCircleSharp />} />} label={t("fullSwipe")} />
      <FormControl fullWidth>
        <InputLabel color='success' id="language-label">{t('language')}</InputLabel>
        <Select
        color='success'
          labelId="language-label"
          id="demo-simple-select"
          value={form.language}
          label={t('language')}
          onChange={onSelectChange}
        >
          <MenuItem value={'en'}>{t('english')}</MenuItem>
          <MenuItem value={'he'}>{t('hebrew')}</MenuItem>
        </Select>
      </FormControl>
      <GlassButton endIcon={<GiSettingsKnobs size={"1.5rem"} color='white'/>} text={t('change')} style={{width: "100%", color: "white"}} type='submit'/>
      </ThemeProvider>
      </form>
    </Fragment>
  )
}

export default Preferences