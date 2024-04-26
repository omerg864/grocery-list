import React from 'react'
import './ItemView.css';
import Item from '../../interface/ItemInterface';
import { CardActionArea, Typography } from '@mui/material';
import SwipeItem from '../SwipeItem/SwipeItem';
import { useTranslation } from 'react-i18next';
import { FaTrash } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";

interface ItemViewProps {
    item: Item
    onSwipeLeft: (id: string) => void
    onSwipeRight: (id: string) => void
}
function ItemView(props: ItemViewProps) {

    const { t } = useTranslation('translation', { keyPrefix: 'ItemView' });

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
            console.log("clicked");
    }

  return (
    <SwipeItem fullSwipe={false} onSwipedLeft={onSwipedLeft} onSwipedRight={onSwipedRight} id={props.item.id} rightBtnOpenWidth={80} leftBtnOpenWidth={80}
    animateDivClass={"item-div"} rightBtnClass='swipe-right-btn' leftBtnClass='swipe-left-btn' rightBtnChildren={rightButton()} leftBtnChildren={leftButton()} 
    mainItemClick={onItemClick}>
        <CardActionArea className='item-container'>
            <div className='item-view'>
                <img className='item-img' src={props.item.img? props.item.img : '/item.png'} alt={props.item.name} />
                <div className="item-details">
                    <Typography sx={{margin: 0, fontWeight: 700}} variant='h6'>{props.item.name}</Typography>
                    <Typography sx={{minHeight: '1.245rem'}} variant='caption'>{props.item.description}</Typography>
                    {props.item.amount && <Typography sx={{margin: 0, fontWeight: 700}} variant='h6'>{props.item.amount} {props.item.unit}</Typography>}
                </div>
            </div>
        </CardActionArea>
    </SwipeItem>
  )
}

export default ItemView