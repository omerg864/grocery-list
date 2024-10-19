import { Chip } from '@mui/material';
import './CategoryList.css';

interface CategoryListProps {
    categories: string[];
    selectedCategory: string;
    onSelect: (category: string) => void;
    containerStyle?: React.CSSProperties;
}
function CategoryList(props: CategoryListProps) {
  return (
    <div style={{...props.containerStyle}} className="category-list">
      {props.categories.map((category: string) => (
          <Chip key={category} onClick={() => props.onSelect(category)} color={props.selectedCategory === category ? 'success' : 'default'} sx={{color: 'white'}}  label={category} variant={props.selectedCategory === category ? 'filled' : 'outlined'} />
      ))}
    </div>
  )
}

export default CategoryList