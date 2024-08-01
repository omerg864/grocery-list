import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useEffect, useState } from 'react';
import Bundle from '../interface/BundleInterface';
import ItemsList from '../components/ItemsList/ItemsList';
import Loading from '../components/Loading/Loading';
import { useRecoilState } from 'recoil';
import { bundleAtom } from '../recoil/atoms';
import { ThemeProvider, useTheme } from '@mui/material';
import formTheme from '../themes/formTheme';
import { useTranslation } from 'react-i18next';



function BundleAdd() {

  const { t } = useTranslation('translation', { keyPrefix: 'BundleAdd' });
  const navigate = useNavigate();
  const [bundle, setBundle] = useRecoilState<Bundle>(bundleAtom);
  const [amounts, setAmounts] = useState<{id: string, amount: number | ""}[]>(bundle.items.map(item => ({id: item._id, amount: 1})));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { id } = useParams();

  const outerTheme = useTheme();

  const back = () => {
    navigate(`/lists/${id}/select`);
  }

  const onItemClicked = (id: string) => {
    navigate(`/lists/${id}/add/bundle/${bundle.id}/item/${id}`);
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
    let form = {
      bundleId: bundle.id,
      amounts
    }
    console.log(form);
  }

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let bundleTemp = {
        id: "1",
        title: 'Bundle 1',
        items: [
          {_id: "1", name: 'Item 1', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc"},
          {_id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
          {_id: "3", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
          {_id: "4", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
          {_id: "5", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
          {_id: "6", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
          {_id: "7", name: 'Item 2', img: "", description: "only shtraus", unit: "kg"},
        ]
      }
      setBundle(bundleTemp);
      setAmounts(bundleTemp.items.map(item => ({id: item._id, amount: 1})));
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <Header title={bundle.title} onBack={back} buttonClick={addBundle} buttonTitle={t('addBundle')}  />
      <div className='list-form'>
        <ThemeProvider theme={formTheme(outerTheme)}>
          <ItemsList addCounter={addCounter} removeCounter={removeCounter} amounts={amounts} onAmountChanged={onChangeAmount} onItemClicked={onItemClicked} items={bundle.items} />
        </ThemeProvider>
      </div>
    </main>
  )
}

export default BundleAdd