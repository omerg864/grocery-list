import { CardActionArea, Typography } from "@mui/material";
import Bundle from "../../interface/BundleInterface";
import SwipeItem from "../SwipeItem/SwipeItem";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import ImagesList from "../ImagesList/ImagesList";
import './BundleViewList.css';


interface BundleViewListProps {
  bundle: Bundle;
  open: string | null;
  setOpen: (id: string | null) => void;
  delete?: boolean;
  onSwipeRight?: (id: string) => void;
}

function BundleViewList(props: BundleViewListProps) {

  const navigate = useNavigate();
    const { id } = useParams<{ id: string}>();

    const onSwipedRight = () => {
        props.onSwipeRight!(props.bundle.id);
        console.log('swiped right');
    }

    const leftButton = (): React.ReactNode => {
        return (
            <div className='swipe-content'>
              <FaTrash size={"1.5rem"} color='white' />
            </div>
        )
    }

    const onItemClick = () => {
        if (id) {
            navigate(`/lists/${id}/bundle/${props.bundle.id}`);
        } else {
            navigate(`/bundles/${props.bundle.id}`);
        }
    }

  return (
    <SwipeItem fullSwipe={false} open={props.open} setOpen={props.setOpen} threshold={0.1} onSwipedRight={onSwipedRight} id={props.bundle.id} leftBtnOpenWidth={80}
    animateDivClass={"item-div"} leftBtnClass='swipe-left-btn' leftBtnChildren={leftButton()} 
    mainItemClick={onItemClick}>
      <CardActionArea className='item-container'>
        <div style={{minHeight: '5rem'}} className='bundle-view'>
          <Typography variant='h6'>{props.bundle.title}</Typography>
          <ImagesList images={props.bundle.items.map(item => item.img ? item.img : './item.png')} />
        </div>
      </CardActionArea>
    </SwipeItem>
  )
}

export default BundleViewList