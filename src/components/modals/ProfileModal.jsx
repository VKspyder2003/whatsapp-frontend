import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';

const ProfileModal = ({ open, handleClose, person }) => {
    const dialogTitleStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    };

    const imgStyle = {
        width: '80px',
        borderRadius: '50%',
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby='parent-modal-title' aria-describedby="parent-modal-description">
            <Box>
                <DialogTitle style={dialogTitleStyle}>
                    <img src={person.picture} alt="Profile" style={imgStyle} />
                </DialogTitle>
                <DialogContent>
                    {person.name}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ProfileModal;