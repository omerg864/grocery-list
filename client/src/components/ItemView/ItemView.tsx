import React from 'react'
import './ItemView.css';
import Item from '../../interface/ItemInterface';
import { CardActionArea, Typography } from '@mui/material';
import SwipeItem from '../SwipeItem/SwipeItem';
import { useTranslation } from 'react-i18next';
import { FaTrash } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import ItemListDisplay from '../ItemListDisplay/ItemListDisplay';
import { useNavigate, useParams } from 'react-router-dom';

interface ItemViewProps {
    item: Item;
    onSwipeLeft: (id: string) => void;
    onSwipeRight: (id: string) => void;
    open: string | null;
    setOpen: (id: string | null) => void;
}
function ItemView(props: ItemViewProps) {

    const { t } = useTranslation('translation', { keyPrefix: 'ItemView' });
    const navigate = useNavigate();
    const { id } = useParams<{ id: string}>();

    const onSwipedLeft = () => {
        props.onSwipeLeft(props.item.id);
        console.log('swiped left');
    }

    const onSwipedRight = () => {
        props.onSwipeRight(props.item.id);
        console.log('swiped right');
    }

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
    const onItemClick = () => {
        if (id) {
            navigate(`/lists/${id}/item/${props.item.id}`);
        } else {
            navigate(`/items/${props.item.id}`);
        }
    }

  return (
    <SwipeItem fullSwipe={false} open={props.open} setOpen={props.setOpen} threshold={0.1} onSwipedLeft={onSwipedLeft} onSwipedRight={onSwipedRight} id={props.item.id} rightBtnOpenWidth={80} leftBtnOpenWidth={80}
    animateDivClass={"item-div"} rightBtnClass='swipe-right-btn' leftBtnClass='swipe-left-btn' rightBtnChildren={rightButton()} leftBtnChildren={leftButton()} 
    mainItemClick={onItemClick}>
        <ItemListDisplay item={props.item} />
    </SwipeItem>
  )
}

export default ItemView