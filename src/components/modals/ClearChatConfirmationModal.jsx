import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';

const ClearChatConfirmationModal = ({ open, handleClose, handleClearChat }) => {
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>Clear Chat Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to clear the chat with this user? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="success">
                    Cancel
                </Button>
                <Button onClick={() => { handleClearChat(); handleClose(); }} color="warning">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ClearChatConfirmationModal;
