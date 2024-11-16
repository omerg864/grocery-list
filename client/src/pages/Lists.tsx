import Header from "../components/Header/Header.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import ListsList from "../components/ListLists/ListsList.tsx";
import SearchBar from "../components/SearchBar/SearchBar.tsx";
import { useRecoilState } from "recoil";
import { listsState, updatedListsAtom } from "../recoil/atoms.ts";
import { Button, IconButton, Tooltip } from "@mui/material";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog.tsx";
import Loading from "../components/Loading/Loading.tsx";
import { del, get } from "../utils/apiRequest.ts";
import Cookies from "universal-cookie";
import ListsInterface, { listsDefault } from "../interface/ListsInterface.ts";
import { getMinutesBetweenDates } from "../utils/functions.ts";
import { LuRefreshCw } from "react-icons/lu";
import { CgMoreO } from "react-icons/cg";

function Lists() {

    const navigate = useNavigate();
    const { t } = useTranslation('translation', { keyPrefix: 'Lists' });
    const [lists, setLists] = useRecoilState<ListsInterface[]>(listsState);
    const [updatedLists, setUpdatedLists] = useRecoilState<Date>(updatedListsAtom);
    const [listsDisplayed, setListsDisplayed] = useState<ListsInterface[]>(lists);
    const [dialog, setDialog] = useState<{open: boolean, id: string | null}>({open: false, id: null});
    const [list, setList] = useState<ListsInterface>(listsDefault);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cookies = new Cookies();


    const newList = () => {
      navigate('/lists/new');
    }

    const goToVariance = () => {
      navigate('/lists/variance');
    }

    const handleClose = () => {
      setList(listsDefault)
      setDialog({open: false, id: null});
    }

    const openDialog = (id: string) => {
      const listFound = lists.find((list) => list._id === id)!;
      setList(listFound);
      setDialog({open: true, id: id});
    }

    const archiveList = (id: string) => {
      setIsLoading(true);
      get(`/api/list/${id}/archive`, (_) => {
        setIsLoading(false);
        setLists((prev) => prev.filter((list) => list._id !== id));
        setListsDisplayed((prev) => prev.filter((list) => list._id !== id));
      }, {
        'Authorization': `Bearer ${cookies.get('userToken')}`,
      });
    }

    const onSearch = (search: string) => {
      const filteredLists = lists.filter((list: ListsInterface) => list.title.toLowerCase().includes(search));
      setListsDisplayed(filteredLists);
    }

    const deleteListForAll = async (id: string) => {
      setIsLoading(true);
      await del(`/api/list/${id}/all`, (_) => {
        setIsLoading(false);
        setLists((prev) => prev.filter((list) => list._id !== id));
        setListsDisplayed((prev) => prev.filter((list) => list._id !== id));
        handleClose();
      }, {
        'Authorization': `Bearer ${cookies.get('userToken')}`,
      });
    }

    const deleteListForMe = (id: string) => {
      setIsLoading(true);
      del(`/api/list/${id}/me`, (_) => {
        setIsLoading(false);
        setLists((prev) => prev.filter((list) => list._id !== id));
        setListsDisplayed((prev) => prev.filter((list) => list._id !== id));
        handleClose();
      }, {
        'Authorization': `Bearer ${cookies.get('userToken')}`,
      });
    }

    const onClick = (id: string) => {
      navigate(`/lists/${id}`);
    }

    const getLists = async () => {
      setIsLoading(true);
      await get('/api/list', (data) => {
        setLists(data.lists);
        setListsDisplayed(data.lists);
        setUpdatedLists(new Date());
      }, {
        'Authorization': `Bearer ${cookies.get('userToken')}`,
      });
      setIsLoading(false);
    }



    useEffect(() => {
      if (getMinutesBetweenDates(updatedLists, new Date()) > 10 || lists.length === 0) {
        getLists();
      }
    }, [])

    if (isLoading) {
      return <Loading />
    }

  return (
    <main>
        <Header buttonTitle={t("addList")} title={t("lists")} buttonClick={newList} sideButton={<Tooltip title={t('variance')}><IconButton onClick={goToVariance} >
          <CgMoreO color="white"/>
        </IconButton></Tooltip>} />
        <ConfirmationDialog  handleClose={handleClose} open={dialog.open} title={t('deleteList')} content={t('deleteListContent')} 
          buttons={<div className='dialog-buttons'>
            <Button onClick={handleClose} variant='outlined' color="primary">{t('cancel')}</Button>
            <div className="two-buttons-dialog" style={{display: 'flex', gap: '10px'}}>
              {list.owner && list.users > 1 && <Button onClick={() => deleteListForAll(dialog.id as string)} variant='outlined' color="error" autoFocus>{t('deleteForAll')}</Button>}
              <Button onClick={() => deleteListForMe(dialog.id as string)} variant='outlined' color="warning" autoFocus>{t('deleteForMe')}</Button>
            </div>
          </div>}/>
        <div style={{display: 'flex', width: '100%'}}>
          <IconButton onClick={getLists}>
            <LuRefreshCw color="white"/>
          </IconButton>
          <SearchBar placeholder={t("search")} onSearch={onSearch}/>
        </div>
        <ListsList onClick={onClick} deleteList={openDialog} archiveList={archiveList} lists={listsDisplayed} />
    </main>
  )
}

export default Lists