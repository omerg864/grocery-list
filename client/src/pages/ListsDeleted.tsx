import Header from "../components/Header/Header.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import List from "../interface/ListInterface.ts";
import ListsList from "../components/ListLists/ListsList.tsx";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog.tsx";
import { FaTrash } from "react-icons/fa";
import Loading from "../components/Loading/Loading.tsx";

function ListsDeleted() {

    const navigate = useNavigate();
    const { t } = useTranslation('translation', { keyPrefix: 'ListsDeleted' });
    const [lists, setLists] = useState<List[]>([{
        id: '1',
        title: 'List 1',
        items: [],
        boughtItems: [],
        createdAt: '2021-10-10',
        updatedAt: '2021-10-10',
        owner: true,
        users: [],
        categories: [],
        deletedItems: []
    }, {
        id: '2',
        title: 'List 2',
        items: [],
        boughtItems: [],
        createdAt: '2021-10-10',
        updatedAt: '2021-10-10',
        owner: true,
        users: [],
        categories: [],
        deletedItems: []
    }]);
    const [dialogContent, setDialogContent] = useState<{open: boolean, title: string, content: string, action: () => void}>({open: false, title: '', content: '', action: () => {}});
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const handleClose = () => {
        setDialogContent({open: false, title: '', content: '', action: () => {}});
    }

    const deleteAll = () => {
        setIsLoading(true);
        setTimeout(() => {
            handleClose();
            setLists([]);
            setIsLoading(false);
        }, 1000);
    }

    const deleteAllDialog = () => {
        setDialogContent({open: true, title: t('deleteAll'), content: t('deleteAllContent'), action: deleteAll});
    }

    const restoreListDialog = (id: string) => {
        setDialogContent({open: true, title: t('restoreList'), content: t('restoreListContent'), action: () => restoreList(id)});
    }

    const restoreList = (id: string) => {
        setIsLoading(true);
        setTimeout(() => {
            handleClose();
            navigate(`/lists/${id}`);
            setIsLoading(false);
        }, 1000);
    }


    const deleteListDialog = (id: string) => {
        setDialogContent({open: true, title: t('deleteList'), content: t('deleteListContent'), action: () => deleteList(id)});
    }

    const deleteList = (id: string) => {
        setIsLoading(true);
        setTimeout(() => {
            setLists((prev) => prev.filter((list) => list.id !== id));
            handleClose();
            setIsLoading(false);
        }, 1000);
    }

    const back = () => {
        navigate('/');
    }

    useEffect(() => {
        
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