import Header from "../components/Header/Header";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FormEvent, useRef, useState } from "react";
import ListFormInterface from "../interface/ListForm";
import ListForm from "../components/ListForm/ListForm";
import Loading from "../components/Loading/Loading";
import { post } from "../utils/apiRequest";
import Cookies from "universal-cookie";

function NewList() {

  const { t } = useTranslation('translation', { keyPrefix: 'NewList' });
  const [form, setForm] = useState<ListFormInterface>({ title: '', prevItems: true, defaultItems: true})
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const cookies = new Cookies();

  const backClick = () => {
    navigate(-1);
  }

  const submitForm = () => {
    if (formRef.current?.checkValidity()) {
      formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }else {
      formRef.current?.reportValidity();
    }
  }

  const createList = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await post('/api/list', form, (_) => {
      navigate('/');
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    });
    setIsLoading(false);
  }

  const onChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.checked });
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  if (isLoading) {
    return <Loading />;
  }


  return (
    <main>
      <Header title={t('newList')} onBack={backClick} buttonTitle={t('create')} buttonClick={submitForm}/>
      <ListForm submit={createList} formRef={formRef} form={form} onChange={onChange} onChecked={onChecked} />
    </main>
  )
}

export default NewList