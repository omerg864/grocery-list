import { CardActionArea, Typography } from '@mui/material';
import SwipeItem from '../SwipeItem/SwipeItem';
import './ListsList.css';
import { FaTrash } from "react-icons/fa";
import { useState } from 'react';
import ArrowForward from '../ArrowForward/ArrowForward';
import Lists from '../../interface/ListsInterface';
import { formatDate } from '../../utils/functions';
import Cookies from 'universal-cookie';
import { useTranslation } from 'react-i18next';


interface ListsListProps {
    lists: Lists[];
    deleteList: (id: string) => void;
    onClick: (id: string) => void;
}
function ListsList(props: ListsListProps) {

    const [open, setOpen] = useState<string | null>(null);
    const { t } = useTranslation('translation', { keyPrefix: 'Generic' });
    const cookies = new Cookies();

    const leftButton = (): React.ReactNode => {
        return (
            <div className='swipe-content'>
                <FaTrash size={"1.5rem"} color='white' />
            </div>
        )
    }

    const user = cookies.get('user');
    const fullSwipe = user && user.fullSwipe ? true : false;

  return (
    <div className='list-lists'>
        {props.lists.length === 0 ? <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}> 
        <img alt="No bundles" style={{width: '60%'}} src="/shopping-cart-icon.png" />
        <Typography variant="h5">{t('noLists')}</Typography>
        </div>  : props.lists.map((list: Lists) => (
            <SwipeItem open={open} setOpen={setOpen} fullSwipe={fullSwipe} leftBtnClass='swipe-left-btn' animateDivClass='list-view' threshold={0.06} onSwipedRight={() => props.deleteList(list._id)} leftBtnChildren={leftButton()} leftBtnOpenWidth={80} mainItemClick={() => props.onClick(list._id)} key={list._id} id={list._id} >
                <CardActionArea className='list-container'>
                    <div className='list-view' style={{ padding: '0 0.5rem' }}>
                        <div className='list-details'>
                            <div className='list-title'>
                                <Typography sx={{margin: 0, fontWeight: 700}} variant='h6'>{list.title}</Typography>
                                <Typography sx={{ fontSize: '1rem'}} variant='caption'>{formatDate(list.updatedAt)}</Typography>
                            </div>
                            <div className="list-amount" >
                                <Typography variant='body1'>{list.boughtItems}/{list.items}</Typography>
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