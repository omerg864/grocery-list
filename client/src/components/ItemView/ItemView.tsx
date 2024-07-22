import React from 'react'
import './ItemView.css';
import Item from '../../interface/ItemInterface';
import SwipeItem from '../SwipeItem/SwipeItem';
import { FaTrash } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import ItemListDisplay from '../ItemListDisplay/ItemListDisplay';

interface ItemViewProps {
    item: Item;
    onSwipeLeft?: (id: string) => void;
    onSwipeRight?: (id: string) => void;
    open: string | null;
    setOpen: (id: string | null) => void;
    onItemClicked?: (id: string) => void;
}
function ItemView(props: ItemViewProps) {

    const leftButton = (): React.ReactNode => {
        return (
            <div className='swipe-content'>
            <FaTrash size={"1.5rem"} color='white' />
            </div>
        )
    }

    const rightButton = (): React.ReactNode => {
        return (
            <div className='swipe-content'>
            <MdAddShoppingCart size={"1.5rem"}  color='white' />
            </div>
        )
    }

    let rightButtonChild, leftButtonChild;

    if (props.onSwipeLeft) {
        rightButtonChild = rightButton();
    }

    if (props.onSwipeRight) {
        leftButtonChild = leftButton();
    }

  return (
    <SwipeItem fullSwipe={false} open={props.open} setOpen={props.setOpen} threshold={0.1} onSwipedLeft={props.onSwipeLeft ? () => props.onSwipeLeft!(props.item.id) : undefined} onSwipedRight={props.onSwipeRight ? () => props.onSwipeRight!(props.item.id) : undefined} id={props.item.id} rightBtnOpenWidth={80} leftBtnOpenWidth={80}
    animateDivClass={"item-div"} rightBtnClass='swipe-right-btn' leftBtnClass='swipe-left-btn' rightBtnChildren={rightButtonChild} leftBtnChildren={leftButtonChild} 
    mainItemClick={() => props.onItemClicked!(props.item.id)}>
        <ItemListDisplay item={props.item} />
    </SwipeItem>
  )
}

export default ItemView