import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import { createRef, useEffect, useState } from 'react';
import Bundle, { bundleDefault } from '../interface/BundleInterface';
import ItemsList from '../components/ItemsList/ItemsList';
import Loading from '../components/Loading/Loading';
import { useRecoilState } from 'recoil';
import { bundleAtom, itemAtom } from '../recoil/atoms';
import { SelectChangeEvent, ThemeProvider, useTheme } from '@mui/material';
import formTheme from '../themes/formTheme';
import { useTranslation } from 'react-i18next';
import { get, post } from '../utils/apiRequest';
import { getMinutesBetweenDates } from '../utils/functions';
import Item from '../interface/ItemInterface';
import Cookies from 'universal-cookie';
import ListItem from '../interface/ListItemInterface';



function BundleAdd() {

  const { t } = useTranslation('translation', { keyPrefix: 'BundleAdd' });
  const navigate = useNavigate();
  const [bundle, setBundle] = useRecoilState<Bundle>(bundleAtom);
  const [amounts, setAmounts] = useState<{id: string, amount: number | "", unit: string}[]>(bundle.items.map(item => ({id: item._id, amount: 1, unit: item.unit})));
  const [_, setItem] = useRecoilState<Item | ListItem>(itemAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cookies = new Cookies();
  const formRef = createRef<HTMLFormElement>();

  const { id, bundleId } = useParams();

  const outerTheme = useTheme();

  const back = () => {
    setBundle(bundleDefault);
    navigate(`/lists/${id}/select`);
  }

  const onItemClicked = (id: string) => {
    setItem(bundle.items.find(item => item._id === id)!);
    navigate(`/lists/${id}/add/bundle/${bundle._id}/item/${id}`);
  }

  const onSelectionChange = (e: SelectChangeEvent, id: string) => {
    const value = e.target.value as string;
    const info = amounts.find(a => a.id === id)!;
    let amount = info.amount;
    if (value !== "") {
      if (typeof amount !== 'number' || amount as number <= 0) {
        amount = 1;
      }
    } else {
      amount = 0;
    }
    setAmounts(amounts.map(a => a.id === id ? {...a, unit: value, amount} : a));
    setBundle({...bundle, items: bundle.items.map(item => item._id === id ? {...item, unit: value} : item)});
  }

  const onChangeAmount = (id: string, amount: string) => {
    let amountTemp: number | "";
    if (amount === "") {
      amountTemp = "";
    } else {
      amountTemp = parseInt(amount);
    }
    setAmounts(amounts.map(a => a.id === id ? {...a, amount: amountTemp} : a));
  }

  const addCounter = (id: string) => {
    let amount = amounts.find(a => a.id === id)!.amount;
    if (amount === "") {
      amount = 1;
    } else {
      amount = amount + 1;
    }
    setAmounts(amounts.map(a => a.id === id ? {...a, amount} : a));
  }

  const removeCounter = (id: string) => {
    let amount = amounts.find(a => a.id === id)!.amount;
    if (amount === "" || amount <= 1) {
      amount = 1;
    } else {
      amount = amount - 1;
    }
    setAmounts(amounts.map(a => a.id === id ? {...a, amount} : a));
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
          <ItemsList onSelectionChange={onSelectionChange} addCounter={addCounter} removeCounter={removeCounter} amounts={amounts} onAmountChanged={onChangeAmount} onItemClicked={onItemClicked} items={bundle.items} />
        </ThemeProvider>
      </form>
    </main>
  )
}

export default BundleAdd