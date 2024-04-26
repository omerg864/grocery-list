import Header from "../components/Header/Header";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ListFormInterface from "../interface/ListForm";
import ListForm from "../components/ListForm/ListForm";

function NewList() {

  const { t } = useTranslation('translation', { keyPrefix: 'newList' });
  const [form, setForm] = useState<ListFormInterface>({ title: '', prevItems: true, defaultItems: true, users: []})
  const navigate = useNavigate();

  const backClick = () => {
    navigate(-1);
  }

  const createList = () => {
    // Create list
  }

  const onChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.checked });
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }


  return (
    <main>
      <Header title={t('newList')} onBack={backClick} buttonTitle={t('create')} buttonClick={createList}/>
      <ListForm form={form} onChange={onChange} onChecked={onChecked} />
    </main>
  )
}

export default NewList