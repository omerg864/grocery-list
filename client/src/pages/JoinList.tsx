import Header from '../components/Header/Header';
import Cookies from 'universal-cookie';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { get, post } from '../utils/apiRequest';
import Lists from '../interface/ListsInterface';
import User from '../interface/UserInterface';
import Loading from '../components/Loading/Loading';
import { useRecoilState } from 'recoil';
import { listsState } from '../recoil/atoms';
import { Typography } from '@mui/material';
import UsersList from '../components/UsersList/UsersList';
import { formatDate } from '../utils/functions';
import GlassButton from '../components/GlassButton/GlassButton';
import { GiPartyPopper } from "react-icons/gi";


interface SharedList {
  users: User[];
  items: number;
  title: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

function JoinList() {

  const { t } = useTranslation('translation', { keyPrefix: 'JoinList' });
  const { token } = useParams();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(false);
  const [_, setLists] = useRecoilState<Lists[]>(listsState);
  const [list, setList] = useState<SharedList>({
    _id: '',
    title: '',
    items: 0,
    createdAt: '',
    updatedAt: '',
    users: []
  });

  const getSharedList = async () => {
    setIsLoading(true);
    await get(`/api/list/${token}/shared`, (data) => {
      setList(data.list);
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`
    })
    setIsLoading(false);
  }

  const joinList = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await post(`/api/list/${token}/share`, {}, (data) => {
      setLists([]);
      navigate(`/lists/${data.id}`);
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`
    })
    setIsLoading(false);
  }

  const back = () => {
    navigate('/');
  }

  useEffect(() => {
    getSharedList();
  }, []);

  if (isLoading) {
    return <Loading />
  }


  return (
    <main>
      <Header title={list.title} onBack={back}/>
      <UsersList users={list.users}/>
      <form className='list-form' onSubmit={joinList}>
        <Typography variant="body1">{t('itemsInList')}: {list.items}</Typography>
        <Typography variant="body1">{t('updatedAt')}: {formatDate(list.updatedAt)}</Typography>
        <Typography variant="body1">{t('createdAt')}: {formatDate(list.createdAt)}</Typography>
        <GlassButton endIcon={<GiPartyPopper size={"1.5rem"} color='white'/>} text={t('joinList')} style={{width: "100%", color: "white"}} type="submit"/>
      </form>
    </main>
  )
}

export default JoinList