import { useEffect, useState } from "react";
import Header from "../components/Header/Header.tsx";
import UsersList from "../components/UsersList/UsersList.tsx";
import ItemsList from "../components/ItemsList/ItemsList.tsx";
import ListFilters from "../components/ListFilters/ListFilters.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { RiFileList3Line } from "react-icons/ri";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import ListInterface from "../interface/ListInterface.ts";
import SearchBar from "../components/SearchBar/SearchBar.tsx";
import User from "../interface/UserInterface.ts";
import { toast } from "react-toastify";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog.tsx";
import { TbShoppingCartPlus } from "react-icons/tb";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import Loading from "../components/Loading/Loading.tsx";
import { get, put } from "../utils/apiRequest.ts";
import Cookies from "universal-cookie";
import { useRecoilState } from "recoil";
import { listAtom } from "../recoil/atoms.ts";
import ListItem from "../interface/ListItemInterface.ts";
import { LuRefreshCw } from "react-icons/lu";

function List() {
    const [list, setList] = useRecoilState<ListInterface>(listAtom);
    const [users, setUsers] = useState<User[]>([ ]);
    const [items, setItems] = useState<ListItem[]>([]);
    const [deletedItems, setDeletedItems] = useState<ListItem[]>(list.deletedItems);
    const [boughtItems, setBoughtItems] = useState<ListItem[]>(list.boughtItems);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [filterList, setFilterList] = useState<number>(0);
    const [displayList, setDisplayList] = useState<ListItem[]>(items);
    const [dialog, setDialog] = useState<boolean>(false);
    const [tokenDialog, setTokenDialog] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cookies = new Cookies();
    const { id } = useParams();
    
    const { t } = useTranslation('translation', { keyPrefix: 'List' });
    const navigate = useNavigate();


    const onSelect = (category: string) => {
        const selected = selectedCategory === category ? "All" : category;
        setSelectedCategory(selected);
        applyFilters(selected, filterList);
    }

    const backClick = () => {
        navigate('/');
    }

    const newSelectItem = () => {
        navigate(`/lists/${id}/select`);
    }

    const applyFilters = (selected: string, filter: number) => {
        const listD = filter == 0 ? items : filter == 1 ? boughtItems : deletedItems;
        if (selected === "All") {
            setDisplayList(listD);
        } else{
            setDisplayList(listD.filter((item) => item.category === selected));
        }
    }

    const clickFilter = () => {
        const filter = filterList == 2 ? 0 : filterList + 1;
        setFilterList(filter);
        applyFilters(selectedCategory, filter);
    }

    const boughtItem = (id: string) => {
        const item = items.find((item) => item._id === id)!;
        setDisplayList((prev) => prev.filter((item) => item._id !== id));
        setItems((prev) => prev.filter((item) => item._id !== id));
        setBoughtItems((prev) => [...prev, items.find((item) => item._id === id)!]);
        get(`/api/list/${list._id}/item/${id}/bought`, (_) => {}, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        }, (message) => {
            toast.error(message);
            if (filterList === 0) {
                setDisplayList((prev) => [...prev, item]);
            }
            setItems((prev) => [...prev, item]);
            setBoughtItems((prev) => prev.filter((item) => item._id !== id));
        });
    }

    const deleteItem = (id: string) => {
        const item = items.find((item) => item._id === id)!;
        setDisplayList((prev) => prev.filter((item) => item._id !== id));
        setItems((prev) => prev.filter((item) => item._id !== id));
        setDeletedItems((prev) => [...prev, items.find((item) => item._id === id)!]);
        get(`/api/list/${list._id}/item/${id}/delete`, (_) => {}, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        }, (message) => {
            toast.error(message);
            if (filterList === 0) {
                setDisplayList((prev) => [...prev, item]);
            }
            setItems((prev) => [...prev, item]);
            setDeletedItems((prev) => prev.filter((item) => item._id !== id));
        });
    }

    const restoreItemDeleted = (id: string) => {
        const item = deletedItems.find((item) => item._id === id);
        setDisplayList((prev) => prev.filter((item) => item._id !== id));
        setDeletedItems((prev) => prev.filter((item) => item._id !== id));
        setItems((prev) => [...prev, item!]);
        get(`/api/list/${list._id}/item/${id}/restore`, (_) => {}, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        }, (message) => {
            toast.error(message);
            if (filterList === 2) {
                setDisplayList((prev) => [...prev, item!]);
            }
            setItems((prev) => [...prev, item!]);
            setDeletedItems((prev) => prev.filter((item) => item._id !== id));
        });
    }

    const restoreItemBought = (id: string) => {
        const item = boughtItems.find((item) => item._id === id);
        setDisplayList((prev) => prev.filter((item) => item._id !== id));
        setBoughtItems((prev) => prev.filter((item) => item._id !== id));
        setItems((prev) => [...prev, item!]);
        get(`/api/list/${list._id}/item/${id}/shop`, (_) => {}, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        }, (message) => {
            toast.error(message);
            if (filterList === 1) {
                setDisplayList((prev) => [...prev, item!]);
            }
            setItems((prev) => [...prev, item!]);
            setBoughtItems((prev) => prev.filter((item) => item._id !== id));
        });
    }

    const deleteUser = () => {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        closeDialog();
    }

    const openDialog = (id: string) => {
        setDialog(true);
        setUserId(id);
    }

    const closeDialog = () => {
        setDialog(false);
        setUserId('');
    }

    const openTokenDialog = () => {
        setTokenDialog(true);
    }

    const closeTokenDialog = () => {
        setTokenDialog(false);
    }

    const onItemClicked = (id: string) => {
        navigate(`/lists/${list._id}/item/${id}`);
    }

    const goToReceipt = () => {
        navigate(`/lists/${list._id}/receipts`);
    }

    const resetToken = async () => {
        await put(`/api/list/${list._id}/share`, {}, (data) => {
            toast.success(t('newTokenGenerated'));
            setList((prev) => ({...prev, token: data.token}));
            closeTokenDialog();
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        })
    }

    const addUser = () => {
        if (navigator.share) {
            navigator.share({
                title: t('shareTitle'),
                text: t('shareText'),
                url: `${import.meta.env.VITE_HOST_URL}/join/${list.token}`,
            });
        } else {
            toast.info(t('linkCopied'));
            navigator.clipboard.writeText(`${import.meta.env.VITE_HOST_URL}/join/${list.token}`); 
        }
    }

    const filterItems = (search: string) => {
        setDisplayList(items.filter((item) => item.name.toLowerCase().includes(search)));
    }
    let deleteAction = {};

    if (list.owner) {
        deleteAction = { onDelete: openDialog };
    } else {
        deleteAction = {};
    }

    let swipeRight = {};

    switch (filterList) {
        case 0:
            swipeRight = { onSwipeRight: deleteItem };
            break;
        case 1:
            swipeRight = { onSwipeRight: restoreItemBought,
                leftIcon: <MdOutlineRemoveShoppingCart size={"1.5rem"} color='white'/>
            };
            break;
    }

    let swipeLeft = {};

    switch (filterList) {
        case 0:
            swipeLeft = { onSwipeLeft: boughtItem };
            break;
        case 2:
            swipeLeft = { onSwipeLeft: restoreItemDeleted,
                rightIcon: <TbShoppingCartPlus size={"1.5rem"} color='white'/> };
            break;
    }

    const getList = async () => {
        setIsLoading(true);
        await get(`/api/list/${id}`, (data) => {
            setList(data.list);
            setItems(data.list.items);
            setDeletedItems(data.list.deletedItems);
            setBoughtItems(data.list.boughtItems);
            setUsers(data.list.users);
            setDisplayList(data.list.items);
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        });
        setIsLoading(false);
    }

    useEffect(() => {
        getList();
    }, []);

    if (isLoading) {
        return <Loading />
    }



  return (
    <main>
        <Header buttonTitle={t("addItem")} title={list.title} onBack={backClick} buttonClick={newSelectItem} sideButton={<Tooltip title={t('receipts')}><IconButton onClick={goToReceipt}>
            <RiFileList3Line color='white'/>
        </IconButton></Tooltip>} />
        <ConfirmationDialog title={t('deleteUserTitle')} content={t('deleteUserContent')} open={dialog} handleClose={closeDialog} handleConfirm={deleteUser}  />
        <ConfirmationDialog title={t('resetShareToken')} content={t('resetShareTokenContent')} open={tokenDialog} handleClose={closeTokenDialog} handleConfirm={resetToken}  />
        <UsersList onReset={openTokenDialog} onAdd={addUser} {...deleteAction} users={users} />
        <SearchBar onSearch={filterItems} placeholder={t("search")} />
        <div style={{display: 'flex', width: '100%'}}>
            <IconButton onClick={getList}>
                <LuRefreshCw size={"1.5rem"} color='white'/>
            </IconButton>
            <ListFilters categories={list.categories} selectedCategory={selectedCategory} onSelect={onSelect} filterList={filterList} onFilter={clickFilter}/>
        </div>
        <ItemsList onItemClicked={onItemClicked} items={displayList} {...swipeLeft} {...swipeRight}/>
    </main>
  )
}

export default List