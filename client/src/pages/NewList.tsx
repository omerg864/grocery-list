import Header from "../components/Header/Header";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ListFormInterface from "../interface/ListForm";
import ListForm from "../components/ListForm/ListForm";
import User from "../interface/UserInterface";

function NewList() {

  const { t } = useTranslation('translation', { keyPrefix: 'NewList' });
  const [form, setForm] = useState<ListFormInterface>({ title: '', prevItems: true, defaultItems: true, users: []})
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const backClick = () => {
    navigate(-1);
  }

  const createList = () => {
    // Create list
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(-1);
    }, 1000);
  }

  const onChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.checked });
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  const onDeleteUser = (id: string) => {
    setForm({ ...form, users: form.users.filter((user) => user.id !== id) });
  }

  const onAddUser = (user: User) => {
    setForm({ ...form, users: [...form.users, user] });
  }


  return (
    <main>
      <Header title={t('newList')} onBack={backClick} buttonTitle={t('create')} buttonClick={createList}/>
      <ListForm onAddUser={onAddUser} form={form} onDeleteUser={onDeleteUser} onChange={onChange} onChecked={onChecked} />
    </main>
  )
}

export default NewList