import { IconButton, Typography } from "@mui/material";
import Receipt from "../../interface/ReceiptInterface";
import './ReceiptsList.css';
import { FaTrash } from "react-icons/fa";
import { formatDate } from "../../utils/functions";
import useWindowDimensions from "../../hooks/useWindowDimensions";

interface ReceiptsListProps {
    receipts: Receipt[];
    onDelete: (id: string) => void;
}   
function ReceiptsList(props: ReceiptsListProps) {

    const dimensions = useWindowDimensions();

    const onImgClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        let image = e.target as HTMLImageElement;
        let imageCopy = image.cloneNode() as HTMLImageElement;
        if (dimensions.height > dimensions.width) {
            imageCopy.style.width = '100%';
            imageCopy.style.height = 'auto';
        } else {
            imageCopy.style.width = 'auto';
            imageCopy.style.height = '100%';
        }
        imageCopy.style.borderRadius = '0';
        let newDiv = document.createElement('div');
        newDiv.style.position = 'fixed';
        newDiv.style.top = '0';
        newDiv.style.left = '0';
        newDiv.style.width = '100%';
        newDiv.style.height = '100%';
        newDiv.style.background = 'rgba(0, 0, 0, 0.8)';
        newDiv.style.display = 'flex';
        newDiv.style.alignItems = 'center';
        newDiv.style.justifyContent = 'center';
        newDiv.style.zIndex = '9000';
        newDiv.appendChild(imageCopy);
        document.body.appendChild(newDiv);
        newDiv.addEventListener('click', () => {
            newDiv.remove();
        });
    }

  return (
    <div className="receipts-list">
        {props.receipts.map((receipt) => (
            <>{receipt.img ? <div key={receipt._id} className="receipt">
                <img className="receipt-img" onClick={onImgClick} src={receipt.img} alt="receipt" />
                <div className="receipt-details" style={{position: 'absolute'}}>
                    <Typography variant="h6">
                        {formatDate(receipt.createdAt)}
                    </Typography>
                    <IconButton onClick={() => props.onDelete(receipt._id)}>
                        <FaTrash size={"1.5rem"} color='red' />
                    </IconButton>
                </div>
            </div> : <div key={receipt._id} className="receipt" style={{textAlign: 'center', background: 'darkgreen'}}>
                <div style={{ padding: '1rem 0', width: '100%'}}>
                    <a href={receipt.url} target="_blank" rel="noreferrer">
                        {receipt.url}
                    </a>
                </div>
                <div className="receipt-details">
                    <Typography variant="h6">
                        {formatDate(receipt.createdAt)}
                    </Typography>
                    <IconButton onClick={() => props.onDelete(receipt._id)}>
                        <FaTrash size={"1.5rem"} color='red' />
                    </IconButton>
                </div>
                </div>}</>
        ))}
    </div>
  )
}

export default ReceiptsList