import { useState, useContext } from 'react';

import InfoDrawer from '../../drawer/InfoDrawer';

import { MoreVert } from '@mui/icons-material'
import { Menu, MenuItem, styled } from '@mui/material';

import { AccountContext } from '../../../context/AccountProvider';

import LogoutConfirmationModal from '../../modals/LogoutConfirmationModal';

const MenuOption = styled(MenuItem)(() => ({
    fontSize: '14px',
    padding: '15px 60px 5px 24px',
    color: '#4A4A4A'
}));
const HeaderMenu = () => {
    const [open, setOpen] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // State for the confirmation modal
    const { setAccount } = useContext(AccountContext);

    const handleClose = () => {
        setOpen(null);
    }

    const handleClick = (event) => {
        setOpen(event.currentTarget);
    }

    const toggleDrawer = () => {
        setOpenDrawer(true)
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
            <MoreVert titleAccess='More Options' onClick={handleClick} />
            <Menu
                anchorEl={open}
                keepMounted
                open={open}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuOption onClick={() => { handleClose(); toggleDrawer(); }}>Profile</MenuOption>
                <MenuOption onClick={handleLogoutConfirmation}>Logout</MenuOption>
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
