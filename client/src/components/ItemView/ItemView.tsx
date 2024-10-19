import React from 'react'
import './ItemView.css';
import Item from '../../interface/ItemInterface';
import SwipeItem from '../SwipeItem/SwipeItem';
import { FaTrash } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import ItemListDisplay from '../ItemListDisplay/ItemListDisplay';
import Cookies from 'universal-cookie';
import ListItem from '../../interface/ListItemInterface';

interface ItemViewProps {
    item: Item | ListItem;
    onSwipeLeft?: (id: string) => void;
    onSwipeRight?: (id: string) => void;
    open: string | null;
    setOpen: (id: string | null) => void;
    onItemClicked?: (id: string) => void;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}
function ItemView(props: ItemViewProps) {

    const cookies = new Cookies();

    const leftButton = (): React.ReactNode => {
        return (
            <div className='swipe-content'>
            {props.leftIcon ? props.leftIcon : <FaTrash size={"1.5rem"} color='white' />}
            </div>
        )
    }

    const rightButton = (): React.ReactNode => {
        return (
            <div className='swipe-content'>
            {props.rightIcon ? props.rightIcon : <MdAddShoppingCart size={"1.5rem"}  color='white' />}
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

    const user = cookies.get('user');
    const fullSwipe = user && user.fullSwipe ? true : false;

  return (
    <SwipeItem fullSwipe={fullSwipe} open={props.open} setOpen={props.setOpen} threshold={0.1} onSwipedLeft={props.onSwipeLeft ? () => props.onSwipeLeft!(props.item._id) : undefined} onSwipedRight={props.onSwipeRight ? () => props.onSwipeRight!(props.item._id) : undefined} id={props.item._id} rightBtnOpenWidth={80} leftBtnOpenWidth={80}
    animateDivClass={"item-div"} rightBtnClass='swipe-right-btn' leftBtnClass='swipe-left-btn' rightBtnChildren={rightButtonChild} leftBtnChildren={leftButtonChild} 
    mainItemClick={() => props.onItemClicked!(props.item._id)}>
        <ItemListDisplay item={props.item} />
    </SwipeItem>
  )
}

export default ItemView