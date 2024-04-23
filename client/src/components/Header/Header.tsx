import './Header.css';
import { Typography, IconButton } from '@mui/material';
import { IoIosArrowBack, IoMdAdd } from "react-icons/io";
import GlassButton from '../GlassButton/GlassButton.tsx';
import { ReactNode } from 'react';



interface ListHeaderProps {
  title: string;
  onBack?: () => void;
  buttonClick?: () => void;
  sideButton?: ReactNode|undefined;
}

function ListHeader(props: ListHeaderProps) {

  return (
    <div className='list-header'>
        <div className='list-header-title'>
          {props.onBack ? <IconButton onClick={props.onBack} > 
            <IoIosArrowBack color='white'/>
          </IconButton> : <div></div>}
          <Typography variant='h4'>{props.title}</Typography>
          {props.sideButton ? props.sideButton : <div></div>}
        </div>
        {props.buttonClick && <GlassButton endIcon={<IoMdAdd size={"1.5rem"} color='black'/>} text={"Add item"} style={{width: "80%", color: "black"}} onClick={props.buttonClick}/>}
    </div>
  )
}

export default ListHeader