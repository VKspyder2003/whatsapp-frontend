import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Box,
    styled,
    Typography,
    DialogContentText
} from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';

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
    background: linear-gradient(135deg, #fff3e0 0%, #ffe8d1 100%);
    padding: 24px;
    border-bottom: 1px solid #ffe0b2;
`;

const IconBox = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background-color: #ff9800;
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

const LogoutBtn = styled(Button)`
    border-radius: 6px;
    text-transform: none;
    font-weight: 500;
    padding: 8px 24px;
    background-color: #ff9800 !important;
    color: white !important;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #e68900 !important;
        box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
    }
    
    &:active {
        transform: scale(0.98);
    }
`;

const LogoutConfirmationModal = ({ open, handleClose, handleLogout }) => {
    return (
        <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitleBox>
                <IconBox>
                    <LogoutOutlined />
                </IconBox>
                <TitleText>Logout?</TitleText>
            </DialogTitleBox>
            <ContentBox>
                <DialogContentText>
                    You will be logged out from your account. You can log back in anytime with your credentials. Make sure all your important messages are saved.
                </DialogContentText>
            </ContentBox>
            <ActionButtonBox>
                <CancelBtn onClick={handleClose}>
                    Stay Logged In
                </CancelBtn>
                <LogoutBtn onClick={handleLogout}>
                    Logout
                </LogoutBtn>
            </ActionButtonBox>
        </StyledDialog>
    );
};

export default LogoutConfirmationModal;
