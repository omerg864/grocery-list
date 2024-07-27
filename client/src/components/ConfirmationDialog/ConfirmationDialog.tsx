import { Button, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './ConfirmationDialog.css';

interface ConfirmationDialogProps {
    open: boolean;
    handleClose: () => void;
    handleConfirm?: () => void;
    title: string;
    content: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    fullWidth?: boolean;
    buttons?: React.ReactNode;
    children?: React.ReactNode;
}

function ConfirmationDialog(props: ConfirmationDialogProps) {

    const { t } = useTranslation('translation', { keyPrefix: 'Generic' });

  return (
    <Dialog
    open={props.open}
    onClose={props.handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    maxWidth={props.maxWidth ? props.maxWidth : 'md'}
    fullWidth={props.fullWidth ? props.fullWidth : true}
  >
    <DialogTitle id="alert-dialog-title">
      {props.title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {props.content}
      </DialogContentText>
      {props.children}
    </DialogContent>
    {props.buttons ? props.buttons :<div className='dialog-buttons'>
      <Button onClick={props.handleClose} variant='outlined' color="primary">{t('cancel')}</Button>
      <Button onClick={props.handleConfirm} variant='outlined' color="error" autoFocus>{t('confirm')}</Button>
    </div>}
  </Dialog>
  )
}

export default ConfirmationDialog