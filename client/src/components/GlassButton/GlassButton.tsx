import { Button } from '@mui/material';
import './GlassButton.css';


interface GlassButtonProps {
    text: string;
    onClick: () => void;
    disabled?: boolean;
    color?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    variant?: 'text' | 'outlined' | 'contained';
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    style?: React.CSSProperties;

}
function GlassButton(props: GlassButtonProps) {

  const handleClick = () => {
    if (!props.disabled) {
        props.onClick();
    }
  }
  
  return (
    <Button onClick={handleClick} size={props.size ? props.size : "small"} sx={props.style ? props.style : {}} className='glass'>
        {props.startIcon &&<div style={{ display: 'flex'}}>
            {props.startIcon}
        </div>}
        {props.text}
        <div style={{display: 'flex'}}>
            {props.endIcon}
        </div>
    </Button>
  )
}

export default GlassButton