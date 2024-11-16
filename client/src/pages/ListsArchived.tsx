import Header from "../components/Header/Header.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import ListsList from "../components/ListLists/ListsList.tsx";
import Loading from "../components/Loading/Loading.tsx";
import Lists from "../interface/ListsInterface.ts";
import { get } from "../utils/apiRequest.ts";
import Cookies from "universal-cookie";
import { listsState } from "../recoil/atoms.ts";
import { useRecoilState } from "recoil";

const ListsArchived = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('translation', { keyPrefix: 'ListsArchived' });
    const [archivedLists, setArchivedLists] = useState<Lists[]>([]);
    const [_, setLists] = useRecoilState<Lists[]>(listsState);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cookies = new Cookies();



    const unarchiveList = async (id: string) => {
        setIsLoading(true);
        await get(`/api/list/${id}/unarchive`, () => {
            setLists((prev) => [...prev, archivedLists.find((list) => list._id === id)!]);
            navigate(`/`);
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        });
        setIsLoading(false);
    }

    const back = () => {
        navigate('/lists/variance');
    }

    const getArchivedLists = async (loading?: boolean) => {
        if (loading)
            setIsLoading(true);
        await get('/api/list/archived', (data) => {
            setArchivedLists(data.lists);
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        });
        if (loading)
            setIsLoading(false);
    }

    const onClick = (id: string) => {
        navigate(`/lists/${id}`);
      }

    useEffect(() => {
        getArchivedLists(true);
    }, []);

    if (isLoading) {
        return <Loading />;
    }

  return (
    <main>
        <Header onBack={back} title={t("archived")}   />
        <ListsList onClick={onClick} archiveList={unarchiveList}  lists={archivedLists} />
    </main>
  )
}

export default ListsArchived