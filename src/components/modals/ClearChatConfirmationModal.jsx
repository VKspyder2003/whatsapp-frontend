import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
    Box,
    styled,
    Typography
} from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    }
}));

const DialogTitleBox = styled(Box)`
    display: flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
    padding: 24px;
    border-bottom: 1px solid #ffebee;
`;

const IconBox = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background-color: #ff4757;
    border-radius: 50%;
    color: white;
    font-size: 24px;
`;

const TitleText = styled(Typography)`
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #1a1a1a !important;
`;

const ContentBox = styled(DialogContent)`
    padding: 24px;
    
    & .MuiDialogContentText-root {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 1.6;
    }
`;

const ActionButtonBox = styled(DialogActions)`
    padding: 16px 24px;
    gap: 12px;
    border-top: 1px solid #f0f0f0;
`;

const CancelBtn = styled(Button)`
    border-radius: 6px;
    text-transform: none;
    font-weight: 500;
    padding: 8px 24px;
    border: 1.5px solid #e0e0e0;
    color: #555;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #f5f5f5;
        border-color: #d0d0d0;
    }
`;

const ConfirmBtn = styled(Button)`
    border-radius: 6px;
    text-transform: none;
    font-weight: 500;
    padding: 8px 24px;
    background-color: #ff4757 !important;
    color: white !important;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #ee3b3b !important;
        box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
    }
    
    &:active {
        transform: scale(0.98);
    }
`;

const ClearChatConfirmationModal = ({ open, handleClose, handleClearChat }) => {
    return (
        <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitleBox>
                <IconBox>
                    <DeleteOutline />
                </IconBox>
                <TitleText>Clear Chat?</TitleText>
            </DialogTitleBox>
            <ContentBox>
                <DialogContentText>
                    This will permanently delete all messages in this chat. This action cannot be undone and you won't be able to recover any deleted messages.
                </DialogContentText>
            </ContentBox>
            <ActionButtonBox>
                <CancelBtn onClick={handleClose}>
                    Keep Chat
                </CancelBtn>
                <ConfirmBtn onClick={() => { handleClearChat(); handleClose(); }}>
                    Clear Chat
                </ConfirmBtn>
            </ActionButtonBox>
        </StyledDialog>
    );
}

export default ClearChatConfirmationModal;
