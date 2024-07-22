import { IconButton } from '@mui/material';
import { GoCheckCircleFill } from "react-icons/go";
import { BsFilterCircle } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import CategoryList from '../CategoryList/CategoryList';

interface CategoryListProps {
    categories: string[];
    selectedCategory: string;
    onSelect: (category: string) => void;
    onFilter: () => void;
    filterList: number;
}
function ListFilters(props: CategoryListProps) {
  return (
    <div className='list-filters'>
        {props.filterList == 0 ? <IconButton sx={{color: 'white'}} onClick={props.onFilter} ><BsFilterCircle /></IconButton> :
        props.filterList == 1 ?
        <IconButton sx={{color: 'green'}} onClick={props.onFilter} ><GoCheckCircleFill /></IconButton> :
        <IconButton sx={{color: 'red'}} onClick={props.onFilter} ><IoIosCloseCircle /></IconButton>}
        <CategoryList categories={props.categories} selectedCategory={props.selectedCategory} onSelect={props.onSelect}/>
    </div>
  )
}

export default ListFilters