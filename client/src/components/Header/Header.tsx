import './Header.css';
import { Typography, IconButton } from '@mui/material';
import { IoMdAdd } from "react-icons/io";
import GlassButton from '../GlassButton/GlassButton.tsx';
import { ReactNode } from 'react';
import ArrowBack from '../ArrowBack/ArrowBack.tsx';



interface ListHeaderProps {
  title: string;
  onBack?: () => void;
  buttonClick?: () => void;
  sideButton?: ReactNode|undefined;
  buttonTitle?: string;
  endIcon?: ReactNode;
  onTitleClick?: () => void;
}

function ListHeader(props: ListHeaderProps) {

  const endIcon = props.endIcon || <IoMdAdd size={"1.5rem"} color='black'/>;

  return (
    <div className='list-header' >
        <div className='list-header-title'>
          {props.onBack ? <IconButton onClick={props.onBack} > 
            <ArrowBack color='white'/>
          </IconButton> : (props.sideButton ? <div style={{width: '2.5rem'}}></div> : <div></div>)}
          <div style={{width: 'fit-content'}} onClick={props.onTitleClick}>
            <Typography sx={{minHeight: '2.625rem', textAlign: 'center', lineBreak: 'anywhere', whiteSpace: 'normal'}} variant='h4'>{props.title}</Typography> 
          </div>
          {props.sideButton ? props.sideButton : (props.onBack ? <div style={{width: '2.5rem'}}></div> : <div></div>)}
        </div>
        {props.buttonClick && <GlassButton endIcon={endIcon} text={props.buttonTitle || ""} style={{width: "80%", color: "black"}} onClick={props.buttonClick}/>}
    </div>
  )
}

export default ListHeader