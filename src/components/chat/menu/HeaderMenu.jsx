import { useState, useContext } from 'react';

import InfoDrawer from '../../drawer/InfoDrawer';
import LogoutConfirmationModal from '../../modals/LogoutConfirmationModal';
import { AccountContext } from '../../../context/AccountProvider';

// Updated MUI Imports
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Menu, MenuItem, ListItemIcon, ListItemText, IconButton, Divider } from '@mui/material';

const HeaderMenu = () => {
    // Renamed 'open' to 'anchorEl' to properly store the HTML element
    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl); 
    
    const [openDrawer, setOpenDrawer] = useState(false);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    
    const { setAccount } = useContext(AccountContext);

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const toggleDrawer = () => {
        setOpenDrawer(true);
    }

    const handleLogout = () => {
        setAccount(null);
        handleClose();
    }

    const handleLogoutConfirmation = () => {
        setConfirmationModalOpen(true);
        handleClose();
    }

    const closeConfirmationModal = () => {
        setConfirmationModalOpen(false);
    }

    return (
        <>
            {/* Wrapped MoreVert in an IconButton for better accessibility and click ripple */}
            <IconButton
                onClick={handleClick}
                title="More Options"
                aria-label="More Options"
                sx={{
                    width: 40,
                    height: 40,
                    p: 0,
                    color: '#54656f'
                }}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>
            
            <Menu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.1))',
                        mt: 1.5,
                        borderRadius: '12px',
                        minWidth: '180px',
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
            >
                {/* Profile Option */}
                <MenuItem 
                    onClick={() => { handleClose(); toggleDrawer(); }}
                    sx={{ borderRadius: '8px', mx: 1, my: 0.5, px: 1.5 }}
                >
                    <ListItemIcon>
                        <AccountCircleOutlinedIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Profile" 
                        primaryTypographyProps={{ fontSize: '14px', fontWeight: 500, color: '#4A4A4A' }} 
                    />
                </MenuItem>

                <Divider sx={{ my: 0.5, mx: 1 }} />

                {/* Logout Option */}
                <MenuItem 
                    onClick={handleLogoutConfirmation}
                    sx={{ 
                        borderRadius: '8px', 
                        mx: 1, 
                        my: 0.5, 
                        px: 1.5,
                        color: 'error.main',
                        '&:hover': {
                            backgroundColor: '#fee2e2', // Light red hover state
                            color: 'error.dark'
                        }
                    }}
                >
                    <ListItemIcon>
                        <LogoutOutlinedIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Logout" 
                        primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }} 
                    />
                </MenuItem>
            </Menu>

            <InfoDrawer open={openDrawer} setOpen={setOpenDrawer} profile={true} />
            
            <LogoutConfirmationModal
                open={confirmationModalOpen}
                handleClose={closeConfirmationModal}
                handleLogout={handleLogout}
            />
        </>
    )
}

export default HeaderMenu;
