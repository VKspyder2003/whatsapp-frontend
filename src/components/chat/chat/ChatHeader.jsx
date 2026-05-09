import { useCallback, useContext, useState, useEffect } from "react";

import { Box, Typography, styled, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from "@mui/material";
import { MoreVert, Visibility, VisibilityOff, Person, DeleteOutline, VolumeOff, Flag } from "@mui/icons-material";

import { defaultProfilePicture } from "../../../constants/data";
import { AccountContext } from "../../../context/AccountProvider";
import { getProfilePictureUrl, setFallbackImage } from "../../../utils/common-utils";

import ProfileModal from "../../modals/ProfileModal";
import ClearChatConfirmationModal from "../../modals/ClearChatConfirmationModal";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { clearConversation } from "../../../service/api";


const StyledMenu = styled(Menu)(() => ({
    '& .MuiPaper-root': {
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        minWidth: '200px',
    }
}));

const MenuOption = styled(MenuItem)(() => ({
    fontSize: '13px',
    padding: '10px 16px',
    color: '#2c3e50',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '4px',
    margin: '4px 8px',
    
    '&:hover': {
        backgroundColor: '#f0f2f5',
        paddingLeft: '18px',
    },
    
    '& .MuiListItemIcon-root': {
        minWidth: '36px',
        color: '#1b8e5c',
    }
}));

const DangerMenuOption = styled(MenuItem)(() => ({
    fontSize: '13px',
    padding: '10px 16px',
    color: '#d32f2f',
    transition: 'all 0.2s ease',
    borderRadius: '4px',
    margin: '4px 8px',
    
    '&:hover': {
        backgroundColor: '#ffebee',
        paddingLeft: '18px',
    },
    
    '& .MuiListItemIcon-root': {
        minWidth: '36px',
        color: '#d32f2f',
    }
}));

const Header = styled(Box)`
    height: 56px;
    background: linear-gradient(135deg, #f5f5f5 0%, #ededed 100%);
    display: flex;
    padding: 8px 20px;
    align-items: center;
    border-bottom: 1px solid #d0d0d0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
`;

const Image = styled('img')({
    width: 44,
    height: 44,
    objectFit: 'cover',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '2px solid transparent',
    '&:hover': {
        border: '2px solid #1b8e5c',
        transform: 'scale(1.05)'
    }
})

const Name = styled(Typography)`
    margin-left: 12px !important;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
        color: #1b8e5c;
    }
`;

const RightContainer = styled(Box)`
    margin-left: auto;
    display: flex;
    gap: 8px;
    align-items: center;
    
    & > svg {
        padding: 8px;
        font-size: 22px;
        color: #555;
        cursor: pointer;
        border-radius: 50%;
        transition: all 0.2s ease;
        
        &:hover {
            background-color: rgba(27, 142, 92, 0.08);
            color: #1b8e5c;
            transform: scale(1.1);
        }
        
        &:active {
            transform: scale(0.95);
        }
    }
`;

const Status = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'isOnline'
})(({ isOnline }) => ({
    fontSize: '12px !important',
    color: 'rgb(0, 0, 0, 0.6) !important',
    marginLeft: '4px !important',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    
    '&::before': {
        content: '""',
        width: '6px',
        height: '6px',
        backgroundColor: isOnline ? '#4caf50' : '#f44336',
        borderRadius: '50%'
    }
}));

const ChatHeader = ({ person, messages, setMessages, isIncognito, setIsIncognito }) => {

    const url = getProfilePictureUrl(person, defaultProfilePicture);

    const { activeUsers, socket, account, setUpdateMessage } = useContext(AccountContext)

    const [open, setOpen] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const isUserOnline = activeUsers?.find(user => user.sub === person.sub);

    const handleIncognitoUpdate = useCallback(({ participants, isIncognito: nextIncognitoState, changedBy }) => {
        const isCurrentConversation = participants?.includes(account.sub) && participants?.includes(person.sub);

        if (!isCurrentConversation) return;

        setIsIncognito(Boolean(nextIncognitoState));

        if (!changedBy) return;

        const actor = changedBy === account.sub ? 'You' : person.name;
        const verb = nextIncognitoState ? 'enabled' : 'disabled';
        toast.info(`${actor} ${verb} incognito mode`);
    }, [account.sub, person.name, person.sub, setIsIncognito]);

    useEffect(() => {
        const socketInstance = socket.current;
        socketInstance?.on('incognitoUpdated', handleIncognitoUpdate);
        return () => {
            socketInstance?.off('incognitoUpdated', handleIncognitoUpdate);
        };
    }, [socket, handleIncognitoUpdate]);


    const handleClick = (event) => {
        setOpen(event.target)
    }

    const handleClose = () => {
        setOpen(null);
    }

    const handleNameClick = () => {
        // console.log("Modal toggled");
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        // console.log("Modal closed");
        setModalOpen(false);
    };

    const clearChat = () => {
        setShowConfirmationModal(true);
    };

    const handleClearChat = async ()=> {
        try {
            if (messages.length === 0) {
                toast.error('Chats are already empty');
                return;
            }
            const result = await clearConversation(messages[0]?.conversationId, { senderId: account.sub, receiverId: person.sub });
            if (result) {
                setMessages([]);
                setUpdateMessage(prev => !prev)
                toast('Chats Cleared Successfully')
            } else {
                toast.error("Failed to clear the chat. Please try again.");
            }
        } catch (error) {
            console.error("Error while clearing chat:", error);
            toast.error("An error occurred. Please try again later.");
        }
    }

    const toggleIncognito = () => {
        const newIncognitoState = !isIncognito;
        socket.current?.emit('setIncognito', {
            senderId: account.sub,
            receiverId: person.sub,
            isIncognito: newIncognitoState
        });
    };


    return (
        <Header>
            <Image
                title="View Profile"
                onClick={handleNameClick}
                src={url}
                alt="dp"
                onError={(event) => setFallbackImage(event, defaultProfilePicture)}
                referrerPolicy="no-referrer"
            />
            <Box>
                <Name onClick={handleNameClick}>{person.name}</Name>
                <Status isOnline={isUserOnline}>
                    {isUserOnline ? 'Online' : 'Offline'}
                </Status>
            </Box>
            <RightContainer>
                {isIncognito ? (
                    <VisibilityOff titleAccess="Incognito Off" onClick={() => { toggleIncognito(); }} />
                ) : (
                    <Visibility titleAccess="Incognito On" onClick={() => { toggleIncognito(); }} />
                )}
                <MoreVert titleAccess="More Options" onClick={handleClick} />
                <StyledMenu
                    anchorEl={open}
                    keepMounted
                    open={Boolean(open)}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuOption onClick={() => { handleNameClick(); handleClose(); }}>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>View Profile</ListItemText>
                    </MenuOption>
                    
                    <Divider style={{ margin: '8px 0', backgroundColor: '#e0e0e0' }} />
                    
                    <MenuOption onClick={() => { toast.info('Notifications muted for 8 hours'); handleClose(); }}>
                        <ListItemIcon>
                            <VolumeOff fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Mute Notifications</ListItemText>
                    </MenuOption>
                    
                    <MenuOption onClick={() => { clearChat(); handleClose(); }}>
                        <ListItemIcon>
                            <DeleteOutline fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Clear Chat</ListItemText>
                    </MenuOption>
                    
                    <Divider style={{ margin: '8px 0', backgroundColor: '#e0e0e0' }} />
                    
                    <DangerMenuOption onClick={() => { toast.info('Chat reported'); handleClose(); }}>
                        <ListItemIcon>
                            <Flag fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Report Chat</ListItemText>
                    </DangerMenuOption>
                </StyledMenu>
            </RightContainer>
            <ProfileModal open={isModalOpen} handleClose={handleCloseModal} person={person} />
            <ToastContainer position="top-center" autoClose={3000} />
            <ClearChatConfirmationModal
                open={showConfirmationModal}
                handleClose={() => setShowConfirmationModal(false)}
                handleClearChat={handleClearChat}
            />
        </Header>
    )
}

export default ChatHeader;
