import Header from "../components/Header/Header.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import List from "../interface/ListInterface.ts";
import ListsList from "../components/ListLists/ListsList.tsx";
import SearchBar from "../components/SearchBar/SearchBar.tsx";
import { useRecoilState } from "recoil";
import { listsState } from "../recoil/atoms.ts";

function Lists() {

    const navigate = useNavigate();
    const { t } = useTranslation('translation', { keyPrefix: 'Lists' });
    const [lists, setLists] = useRecoilState<List[]>(listsState);
    const [listsDisplayed, setListsDisplayed] = useState<List[]>(lists);


    const newList = () => {
      console.log('new list');
      navigate('/lists/new');
    }

    const onSearch = (search: string) => {
      // TODO: filter lists by search to:[user]
      const filteredLists = lists.filter((list: List) => list.title.toLowerCase().includes(search));
      setListsDisplayed(filteredLists);
    }

  return (
    <main>
        <Header buttonTitle={t("addList")} title={t("lists")} buttonClick={newList} />
        <SearchBar placeholder={t("search")} onSearch={onSearch}/>
        <ListsList lists={listsDisplayed} />
    </main>
  )
}

export default Lists