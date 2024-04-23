import Item from "../../interface/ItemInterface.ts";
import ItemView from "../ItemView/ItemView.tsx";
import './ItemsList.css';

interface ItemsListProps {
    items: Item[];
}

function ItemsList(props: ItemsListProps) {
  return (
    <div className="items-list">
        {props.items.map((item: Item) => (
          <>
          <ItemView item={item} />
          </>
        ))}
    </div>
  )
}

export default ItemsList