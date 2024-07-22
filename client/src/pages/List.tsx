import { useState } from "react";
import Header from "../components/Header/Header.tsx";
import UsersList from "../components/UsersList/UsersList.tsx";
import ItemsList from "../components/ItemsList/ItemsList.tsx";
import Item from "../interface/ItemInterface.ts";
import ListFilters from "../components/ListFilters/ListFilters.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { RiFileList3Line } from "react-icons/ri";
import { IconButton } from "@mui/material";
import i18n from "i18next";
import 'react-swipeable-list/dist/styles.css';
import { useTranslation } from "react-i18next";
import ListInterface from "../interface/ListInterface.ts";
import SearchBar from "../components/SearchBar/SearchBar.tsx";
import User from "../interface/UserInterface.ts";
import { toast } from "react-toastify";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog.tsx";

function List() {
    const [users, setUsers] = useState<User[]>([ {id: "1", f_name: 'John', l_name: "Doe", avatar: "https://mui.com/static/images/avatar/1.jpg"}, {id: "2", f_name: 'Omer', l_name: "Gai", avatar: ""}]);
    const [items, setItems] = useState<Item[]>([{id: "1", name: 'Item 1', category: "Fruits", img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc", amount: 2}, {id: "2", name: 'Item 2', img: "", description: "only shtraus", unit: "KG", amount: 2}]);
    const [deletedItems, setDeletedItems] = useState<Item[]>([]);
    const [boughtItems, setBoughtItems] = useState<Item[]>([]);
    const [list, setList] = useState<ListInterface>({
        "id": "1",
        "title": "Grocery Shopping",
        "categories": ["Fruits", "Home Essentials"],
        "items": [],
        "users": ["user123", "user456"],
        "owner": true,
        "createdAt": "2021-10-10T10:00:00.000Z",
        "updatedAt": "2021-10-10T10:00:00.000Z",
        boughtItems: [],
        deletedItems: []
    });
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [filterList, setFilterList] = useState<number>(0);
    const [displayList, setDisplayList] = useState<Item[]>(items);
    const [dialog, setDialog] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');
    let { id } = useParams();
    
    const { t } = useTranslation('translation', { keyPrefix: 'List' });
    const navigate = useNavigate();


    const onSelect = (category: string) => {
        const selected = selectedCategory === category ? "All" : category;
        setSelectedCategory(selected);
        applyFilters(selected, filterList);
    }

    const backClick = () => {
        i18n.changeLanguage('en');
        navigate('/');
    }

    const newSelectItem = () => {
        
        navigate(`/lists/${id}/selectItem`);
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

    const onSwipeLeft = (id: string) => {
        setDisplayList((prev) => prev.filter((item) => item.id !== id));
        setItems((prev) => prev.filter((item) => item.id !== id));
        setBoughtItems((prev) => [...prev, items.find((item) => item.id === id)!]);
    }

    const onSwipeRight = (id: string) => {
        setDisplayList((prev) => prev.filter((item) => item.id !== id));
        setItems((prev) => prev.filter((item) => item.id !== id));
        setDeletedItems((prev) => [...prev, items.find((item) => item.id === id)!]);
    }

    const deleteUser = () => {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
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

    const addUser = () => {
        if (navigator.share) {
              navigator.share({
                title: t('shareTitle'),
                text: t('shareText'),
                url: `${import.meta.env.VITE_API_URL}/join/${list.id}`, // Replace with your link
              });
          } else {
            toast.info(t('linkCopied'));
            navigator.clipboard.writeText(`${import.meta.env.VITE_API_URL}/join/${list.id}`); // Replace with your link
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


  return (
    <main>
        <Header buttonTitle={t("addItem")} title={list.title} onBack={backClick} buttonClick={newSelectItem} sideButton={<IconButton>
            <RiFileList3Line color='white'/>
        </IconButton>} />
        <ConfirmationDialog title={t('deleteUserTitle')} content={t('deleteUserContent')} open={dialog} handleClose={closeDialog} handleConfirm={deleteUser}  />
        <UsersList onAdd={addUser} {...deleteAction} users={users} />
        <SearchBar onSearch={filterItems} placeholder={t("search")} />
        <ListFilters categories={list.categories} selectedCategory={selectedCategory} onSelect={onSelect} filterList={filterList} onFilter={clickFilter}/>
        <ItemsList items={displayList} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}/>
    </main>
  )
}

export default List