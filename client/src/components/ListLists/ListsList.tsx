import { CardActionArea, Typography } from '@mui/material';
import List from '../../interface/ListInterface';
import SwipeItem from '../SwipeItem/SwipeItem';
import './ListsList.css';
import { FaTrash } from "react-icons/fa";
import { useState } from 'react';
import ArrowForward from '../ArrowForward/ArrowForward';


interface ListsListProps {
    lists: List[];
    deleteList: (id: string) => void
    onClick: (id: string) => void
}
function ListsList(props: ListsListProps) {

    const [open, setOpen] = useState<string | null>(null);

    const leftButton = (): React.ReactNode => {
        return (
            <div className='swipe-content'>
                <FaTrash size={"1.5rem"} color='white' />
            </div>
        )
    }

  return (
    <div className='list-lists'>
        {props.lists.map((list: List) => (
            <SwipeItem open={open} setOpen={setOpen} fullSwipe={false} leftBtnClass='swipe-left-btn' animateDivClass='list-view' threshold={0.06} onSwipedRight={() => props.deleteList(list.id)} leftBtnChildren={leftButton()} leftBtnOpenWidth={80} mainItemClick={() => props.onClick(list.id)} key={list.id} id={list.id} >
                <CardActionArea className='list-container'>
                    <div className='list-view'>
                        <div className='list-details'>
                            <div className='list-title'>
                                <Typography sx={{margin: 0, fontWeight: 700}} variant='h6'>{list.title}</Typography>
                                <Typography variant='caption'>{list.updatedAt}</Typography>
                            </div>
                            <div className="list-amount" >
                                <Typography variant='body1'>{list.boughtItems.length}/{list.items.length}</Typography>
                                <ArrowForward size='1.2rem'/>
                            </div>
                        </div>
                    </div>
                </CardActionArea>
            </SwipeItem>
        ))}
    </div>
  )
}

export default ListsList