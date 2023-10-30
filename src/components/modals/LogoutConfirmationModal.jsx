import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const LogoutConfirmationModal = ({ open, handleClose, handleLogout }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                Are you sure you want to log out?
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="success">
                    Cancel
                </Button>
                <Button onClick={handleLogout} color="error">
                    Logout
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LogoutConfirmationModal;
