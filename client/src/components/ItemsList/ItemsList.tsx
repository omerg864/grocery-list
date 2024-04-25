import Item from "../../interface/ItemInterface.ts";
import ItemView from "../ItemView/ItemView.tsx";
import './ItemsList.css';

interface ItemsListProps {
    items: Item[];
    onSwipeRight: (id: string) => void
    onSwipeLeft: (id: string) => void
}

function ItemsList(props: ItemsListProps) {
  return (
    <div className="items-list">
        {props.items.map((item: Item) => (
          <ItemView key={item.id} item={item} onSwipeRight={props.onSwipeRight} onSwipeLeft={props.onSwipeLeft}/>
        ))}
    </div>
  )
}

export default ItemsList