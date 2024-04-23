import { Chip, IconButton } from '@mui/material';
import './CategoryList.css';
import { GoCheckCircleFill } from "react-icons/go";
import { BsFilterCircle } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";

interface CategoryListProps {
    categories: string[];
    selectedCategory: string;
    onSelect: (category: string) => void;
    onFilter: () => void;
    filterList: number;
}
function CategoryList(props: CategoryListProps) {
  return (
    <div className='list-filters'>
        {props.filterList == 0 ? <IconButton sx={{color: 'white'}} onClick={props.onFilter} ><BsFilterCircle /></IconButton> :
        props.filterList == 1 ?
        <IconButton sx={{color: 'green'}} onClick={props.onFilter} ><GoCheckCircleFill /></IconButton> :
        <IconButton sx={{color: 'red'}} onClick={props.onFilter} ><IoIosCloseCircle /></IconButton>}
        <div className="category-list">
            {props.categories.map((category: string) => (
                <Chip onClick={() => props.onSelect(category)} color={props.selectedCategory === category ? 'success' : 'default'} sx={{color: 'white'}}  label={category} variant={props.selectedCategory === category ? 'filled' : 'outlined'} />
            ))}
        </div>
    </div>
  )
}

export default CategoryList