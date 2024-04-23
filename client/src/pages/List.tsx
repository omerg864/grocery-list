import { useState } from "react";
import Header from "../components/Header/Header.tsx";
import UsersList from "../components/UsersList/UsersList.tsx";
import ItemsList from "../components/ItemsList/ItemsList.tsx";
import Item from "../interface/ItemInterface.ts";
import CategoryList from "../components/CategoryList/CategoryList.tsx";
import { useNavigate } from "react-router-dom";
import { RiFileList3Line } from "react-icons/ri";
import { IconButton } from "@mui/material";
import i18n from "i18next";
import 'react-swipeable-list/dist/styles.css';

function List() {
    const [users, setUsers] = useState([ {id: 1, f_name: 'John', l_name: "Doe", avatar: "https://mui.com/static/images/avatar/1.jpg"}, {id: 2, f_name: 'Omer', l_name: "Gai", avatar: ""}]);
    const [items, setItems] = useState<Item[]>([{id: 1, name: 'Item 1', img: "https://i5.walmartimages.com/seo/Fresh-Banana-Fruit-Each_5939a6fa-a0d6-431c-88c6-b4f21608e4be.f7cd0cc487761d74c69b7731493c1581.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF", description: "", unit: "pc", amount: 2}, {id: 2, name: 'Item 2', img: "", description: "only shtraus", unit: "KG", amount: 2}]);
    const [list, setList] = useState<{ title: string, categories: string[]}>({title: "Shopping List", categories: ["Fruits", "Vegetables", "Dairy", "Meat", "Bakery", "Canned Goods", "Frozen Foods", "Beverages", "Snacks", "Cleaning Supplies", "Personal Care", "Baby", "Pet"]});
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [filterList, setFilterList] = useState<number>(0);
    const [displayList, setDisplayList] = useState<Item[]>(items);
    
    const navigate = useNavigate();


    const onSelect = (category: string) => {
        setSelectedCategory((prev) => prev === category ? "All" : category);
    }

    const backClick = () => {
        i18n.changeLanguage('en');
        navigate('/');
    }

    const newSelectItem = () => {
        navigate('/select-item');
    }

    const clickFilter = () => {
        setFilterList((prev) => {
            if(prev == 2) {
                return 0
            }
            return prev + 1;
        });
    }


  return (
    <main>
        <Header title={list.title} onBack={backClick} buttonClick={newSelectItem} sideButton={<IconButton>
            <RiFileList3Line color='white'/>
        </IconButton>} />
        <UsersList users={users} />
        <CategoryList categories={list.categories} selectedCategory={selectedCategory} onSelect={onSelect} filterList={filterList} onFilter={clickFilter}/>
        <ItemsList items={items} />
    </main>
  )
}

export default List