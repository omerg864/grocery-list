import Header from "../components/Header/Header.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import ListsList from "../components/ListLists/ListsList.tsx";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog.tsx";
import { FaTrash } from "react-icons/fa";
import Loading from "../components/Loading/Loading.tsx";
import Lists from "../interface/ListsInterface.ts";
import { del, get } from "../utils/apiRequest.ts";
import Cookies from "universal-cookie";

function ListsDeleted() {

    const navigate = useNavigate();
    const { t } = useTranslation('translation', { keyPrefix: 'ListsDeleted' });
    const [lists, setLists] = useState<Lists[]>([]);
    const [dialogContent, setDialogContent] = useState<{open: boolean, title: string, content: string, action: () => void}>({open: false, title: '', content: '', action: () => {}});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cookies = new Cookies();


    const handleClose = () => {
        setDialogContent({open: false, title: '', content: '', action: () => {}});
    }

    const deleteAll = async () => {
        setIsLoading(true);
        del('/api/list/deleteAll', () => {
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        });
        getLists();
        handleClose();
        navigate('/');
        setIsLoading(false);
    }

    const deleteAllDialog = () => {
        setDialogContent({open: true, title: t('deleteAll'), content: t('deleteAllContent'), action: deleteAll});
    }

    const restoreListDialog = (id: string) => {
        setDialogContent({open: true, title: t('restoreList'), content: t('restoreListContent'), action: () => restoreList(id)});
    }

    const restoreList = async (id: string) => {
        setIsLoading(true);
        await get(`/api/list/${id}/restore`, () => {
            handleClose();
            navigate(`/lists/${id}`);
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        });
        setIsLoading(false);
    }


    const deleteListDialog = (id: string) => {
        setDialogContent({open: true, title: t('deleteList'), content: t('deleteListContent'), action: () => deleteList(id)});
    }

    const deleteList = async (id: string) => {
        setIsLoading(true);
        await del(`/api/list/${id}/permanently`, () => {
            getLists();
            handleClose();
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        });
        setIsLoading(false);
    }

    const back = () => {
        navigate('/');
    }

    const getLists = async () => {
        setIsLoading(true);
        await get('/api/list/deleted', (data) => {
            setLists(data.lists);
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        });
        setIsLoading(false);
    }

    useEffect(() => {
        getLists()
    }, []);

    if (isLoading) {
        return <Loading />;
    }



  return (
    <main>
        <Header buttonTitle={t("deleteAll")} onBack={back} endIcon={<FaTrash size={"1.1rem"} color='black' />} title={t("recentlyDeleted")} buttonClick={deleteAllDialog}  />
        <ConfirmationDialog open={dialogContent.open} handleClose={handleClose} handleConfirm={dialogContent.action} title={dialogContent.title} content={dialogContent.content} />
        <ListsList onClick={restoreListDialog} deleteList={deleteListDialog} lists={lists} />
    </main>
  )
}

export default ListsDeleted