import Header from "../components/Header/Header.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import List from "../interface/ListInterface.ts";
import ListsList from "../components/ListLists/ListsList.tsx";
import SearchBar from "../components/SearchBar/SearchBar.tsx";
import { useRecoilState } from "recoil";
import { listsState, listAtom } from "../recoil/atoms.ts";
import { MdOutlineAutoDelete } from "react-icons/md";
import { IconButton, Tooltip } from "@mui/material";

function Lists() {

    const navigate = useNavigate();
    const { t } = useTranslation('translation', { keyPrefix: 'Lists' });
    const [lists, setLists] = useRecoilState<List[]>(listsState);
    const [_, setList] = useRecoilState<List>(listAtom);
    const [listsDisplayed, setListsDisplayed] = useState<List[]>(lists);


    const newList = () => {
      navigate('/lists/new');
    }

    const onSearch = (search: string) => {
      // TODO: filter lists by search to:[user]
      const filteredLists = lists.filter((list: List) => list.title.toLowerCase().includes(search));
      setListsDisplayed(filteredLists);
    }

    const deleteList = (id: string) => {
      setLists((prev) => prev.filter((list) => list.id !== id));
      setListsDisplayed((prev) => prev.filter((list) => list.id !== id));
    }

    const onClick = (id: string) => {
      const selectedList = lists.find((list) => list.id === id);
      setList(selectedList!);
      navigate(`/lists/${id}`);
    }

  return (
    <main>
        <Header buttonTitle={t("addList")} title={t("lists")} buttonClick={newList} sideButton={<Tooltip title={t('recentlyDeleted')}><IconButton >
          <MdOutlineAutoDelete color="white"/>
        </IconButton></Tooltip>} />
        <SearchBar placeholder={t("search")} onSearch={onSearch}/>
        <ListsList onClick={onClick} deleteList={deleteList} lists={listsDisplayed} />
    </main>
  )
}

export default Lists