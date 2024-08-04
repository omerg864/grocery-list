import Header from "../components/Header/Header";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useRef, useState } from "react";
import ListFormInterface from "../interface/ListForm";
import ListForm from "../components/ListForm/ListForm";
import Loading from "../components/Loading/Loading";
import { get, post } from "../utils/apiRequest";
import Cookies from "universal-cookie";
import { useRecoilState } from "recoil";
import Lists from "../interface/ListsInterface";
import { listsState, updatedListsAtom } from "../recoil/atoms";
import { getMinutesBetweenDates } from "../utils/functions";
import { SelectChangeEvent } from "@mui/material";

function NewList() {

  const { t } = useTranslation('translation', { keyPrefix: 'NewList' });
  const [form, setForm] = useState<ListFormInterface>({ title: '', prevListItems: '', defaultItems: true});
  const [lists, setLists] = useRecoilState<Lists[]>(listsState);
  const [updatedLists, setUpdatedLists] = useRecoilState<Date>(updatedListsAtom);
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

  const onSelectionChange = (e: SelectChangeEvent) => {
    const value = e.target.value as string;
    setForm(prev => ({...prev, prevListItems: value}));
  }

  const createList = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await post('/api/list', form, () => {
      setLists([]);
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

  const getLists = async () => {
    setIsLoading(true);
    await get('/api/list', (data) => {
      setLists(data.lists);
      setUpdatedLists(new Date());
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    });
    setIsLoading(false);
  }

  useEffect(() => {
    if (lists.length === 0 || getMinutesBetweenDates(updatedLists, new Date()) > 10) {
      getLists();
    }
  }, [])

  if (isLoading) {
    return <Loading />;
  }


  return (
    <main>
      <Header title={t('newList')} onBack={backClick} buttonTitle={t('create')} buttonClick={submitForm}/>
      <ListForm onSelectionChange={onSelectionChange} lists={lists} submit={createList} formRef={formRef} form={form} onChange={onChange} onChecked={onChecked} />
    </main>
  )
}

export default NewList