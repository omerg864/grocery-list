import { useTranslation } from "react-i18next";
import Header from "../components/Header/Header.tsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog.tsx";
import { Button, TextField } from "@mui/material";
import Loading from "../components/Loading/Loading.tsx";
import ReceiptsList from "../components/ReceiptsList/ReceiptsList.tsx";
import Receipt from "../interface/ReceiptInterface.ts";
import { del, get, post } from "../utils/apiRequest.ts";
import Cookies from "universal-cookie";

function ListReceipts() {

    const { t } = useTranslation('translation', { keyPrefix: 'ListReceipts' });
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const [open, setOpen] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [deleteDialog, setDeleteDialog] = useState<string>('');
    const cookies = new Cookies();


    const back = () => {
        navigate(`/lists/${id}`);
    }

    const closeDialog = () => {
        setOpen(false);
    }

    const openDialog = () => {
        setOpen(true);
    }

    const addReceipt = async () => {
        if (!file) {
            return;
        }
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file!);
        await post(`/api/receipt/${id}`, formData, (data) => {
            closeDialog();
            setReceipts((prev) => [...prev, data.receipt]);
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
            'Content-Type': 'multipart/form-data',
        });
        setIsLoading(false);
    }

    const openDeleteDialog = (id: string) => {
        setDeleteDialog(id);
    }

    const closeDeleteDialog = () => {
        setDeleteDialog('');
    }

    const deleteReceipt = async () => {
        setIsLoading(true);
        await del(`/api/receipt/${id}/${deleteDialog}`, (_) => {
            setReceipts((prev) => prev.filter((receipt) => receipt._id !== deleteDialog));
            closeDeleteDialog();
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        });
        setIsLoading(false);
    }

    const getReceipts = async () => {
        setIsLoading(true);
        await get(`/api/receipt/${id}`, (data) => {
            setReceipts(data.receipts);
        }, {
            'Authorization': `Bearer ${cookies.get('userToken')}`,
        })
        setIsLoading(false);
    }

    useEffect(() => {
        getReceipts();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

  return (
    <main>
        <Header title={t('receipts')} onBack={back} buttonClick={openDialog} buttonTitle={t('uploadReceipt')}  />
        <ConfirmationDialog open={open} handleClose={closeDialog} title={t('uploadReceipt')} content={''} buttons={<div className="dialog-buttons">
            <Button onClick={closeDialog} variant='outlined' color="error">{t('cancel')}</Button>
            <Button onClick={addReceipt} variant='outlined' color="primary" autoFocus>{t('upload')}</Button>
        </div>} >
            <div style={{marginTop: '1rem'}}>
                <TextField type='file' onChange={(e) => setFile((e.target as HTMLInputElement).files![0])} />
            </div>
        </ConfirmationDialog>
        <ConfirmationDialog open={deleteDialog !== ''} handleConfirm={deleteReceipt} handleClose={closeDeleteDialog} title={t('deleteReceipt')} content={t('deleteReceiptContent')} />
        <ReceiptsList onDelete={openDeleteDialog} receipts={receipts}/>
    </main>
  )
}

export default ListReceipts