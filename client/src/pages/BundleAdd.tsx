import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import { createRef, useEffect, useState } from 'react';
import Bundle from '../interface/BundleInterface';
import ItemsList from '../components/ItemsList/ItemsList';
import Loading from '../components/Loading/Loading';
import { useRecoilState } from 'recoil';
import { bundleAtom } from '../recoil/atoms';
import { ThemeProvider, useTheme } from '@mui/material';
import formTheme from '../themes/formTheme';
import { useTranslation } from 'react-i18next';
import { get, post } from '../utils/apiRequest';
import { getMinutesBetweenDates } from '../utils/functions';
import Item from '../interface/ItemInterface';
import Cookies from 'universal-cookie';



function BundleAdd() {

  const { t } = useTranslation('translation', { keyPrefix: 'BundleAdd' });
  const navigate = useNavigate();
  const [bundle, setBundle] = useRecoilState<Bundle>(bundleAtom);
  const [amounts, setAmounts] = useState<{id: string, amount: number | ""}[]>(bundle.items.map(item => ({id: item._id, amount: 1})));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cookies = new Cookies();
  const formRef = createRef<HTMLFormElement>();

  const { id, bundleId } = useParams();

  const outerTheme = useTheme();

  const back = () => {
    setBundle({
      _id: '',
      title: '',
      items: [],
    });
    navigate(`/lists/${id}/select`);
  }

  const onItemClicked = (id: string) => {
    navigate(`/lists/${id}/add/bundle/${bundle._id}/item/${id}`);
  }

  const onChangeAmount = (id: string, amount: string) => {
    let amountTemp: number | "";
    if (amount === "") {
      amountTemp = "";
    } else {
      amountTemp = parseInt(amount);
    }
    setAmounts(amounts.map(a => a.id === id ? {id, amount: amountTemp} : a));
  }

  const addCounter = (id: string) => {
    let amount = amounts.find(a => a.id === id)!.amount;
    if (amount === "") {
      amount = 1;
    } else {
      amount = amount + 1;
    }
    setAmounts(amounts.map(a => a.id === id ? {id, amount} : a));
  }

  const removeCounter = (id: string) => {
    let amount = amounts.find(a => a.id === id)!.amount;
    if (amount === "" || amount <= 1) {
      amount = 1;
    } else {
      amount = amount - 1;
    }
    setAmounts(amounts.map(a => a.id === id ? {id, amount} : a));
  }

  const addBundle = async () => {
    setIsLoading(true);
    await post(`/api/list/${id}/bundle/${bundle._id}`, {amounts}, (_) => {
      navigate(`/lists/${id}`);
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    });
    setIsLoading(false);
  }

  const checkForm = async () => {
    if (formRef.current?.checkValidity()) {
      addBundle();
    }else {
      formRef.current?.reportValidity();
    }
    let form = {
      bundleId: bundle._id,
      amounts
    }
    console.log(form);
  }

  const getBundle = async () => {
    setIsLoading(true);
    await get(`/api/bundle/${bundleId}`, (data) => {
      setBundle(data.bundle);
      setAmounts(data.bundle.items.map((item: Item) => ({id: item._id, amount: 1})));
    }, {
      'Authorization': `Bearer ${cookies.get('userToken')}`,
    });
    setIsLoading(false);
  }

  useEffect(() => {
    if (!bundle._id || getMinutesBetweenDates(bundle.stateUpdated as Date, new Date()) > 10) {
      getBundle();
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <Header title={bundle.title} onBack={back} buttonClick={checkForm} buttonTitle={t('addBundle')}  />
      <form className='list-form' ref={formRef}>
        <ThemeProvider theme={formTheme(outerTheme)}>
          <ItemsList addCounter={addCounter} removeCounter={removeCounter} amounts={amounts} onAmountChanged={onChangeAmount} onItemClicked={onItemClicked} items={bundle.items} />
        </ThemeProvider>
      </form>
    </main>
  )
}

export default BundleAdd