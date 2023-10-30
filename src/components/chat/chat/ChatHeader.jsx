import { useContext, useState, useEffect } from "react";

import { Box, Typography, styled, Menu, MenuItem } from "@mui/material";
import { MoreVert, Visibility, VisibilityOff } from "@mui/icons-material";

import { defaultProfilePicture } from "../../../constants/data";
import { AccountContext } from "../../../context/AccountProvider";

import ProfileModal from "../../modals/ProfileModal";
import ClearChatConfirmationModal from "../../modals/ClearChatConfirmationModal";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { clearConversation } from "../../../service/api";


const MenuOption = styled(MenuItem)(() => ({
    fontSize: '14px',
    padding: '15px 60px 5px 24px',
    color: '#4A4A4A'
}));

const Header = styled(Box)`
    height: 44px;
    background: #ededed;
    display: flex;
    padding: 8px 16px;
    align-items: center;
`;

const Image = styled('img')({
    width: 40,
    height: 40,
    objectFit: 'cover',
    borderRadius: '50%',
    cursor: 'pointer'
})

const Name = styled(Typography)`
    margin-left: 12px !important;
    cursor: pointer;
`;

const RightContainer = styled(Box)`
    margin-left: auto;
    & > svg {
        padding: 8px;
        font-size: 22px;
        color: #000;
        cursor: pointer;
    }
`;

const Status = styled(Typography)`
    font-size: 12px !important;
    color: rgb(0, 0, 0, 0.6);
    margin-left: 12px !important;
`;

const ChatHeader = ({ person, messages, setMessages, isIncognito, setIsIncognito }) => {

    const url = person.picture || defaultProfilePicture;

    const { activeUsers, socket, account, setUpdateMessage } = useContext(AccountContext)

    const [open, setOpen] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const handleIncognitoToggle = (newIncognitoState) => {
        setIsIncognito(newIncognitoState);
        const message = newIncognitoState
            ? `${person.name} turned ON incognito mode`
            : `${person.name} turned OFF incognito mode`;
        toast(message);
    };

    useEffect(() => {
        const onGetIncognito = (newIncognitoState) => {
            handleIncognitoToggle(newIncognitoState);
        };

        socket.current.on('getIncognito', onGetIncognito);
        return () => {
            socket.removeListener('getIncognito', onGetIncognito);
        };
    }, [socket]);


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
            if (messages.length == 0) {
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
        setIsIncognito(newIncognitoState);

        socket.current.emit('setIncognito', { receiverId: person.sub }, newIncognitoState);

        const message = newIncognitoState
            ? `Incognito mode is now ON for ${person.name}`
            : `Incognito mode is now OFF for ${person.name}`;
        toast(message);
    };


    return (
        <Header>
            <Image title="View Profile" onClick={handleNameClick} src={url} alt="dp" />
            <Box>
                <Name onClick={handleNameClick}>{person.name}</Name>
                <Status>{activeUsers?.find(user => user.sub === person.sub) ? 'Online' : 'Offline'}</Status>
            </Box>
            <RightContainer>
                {isIncognito ? (
                    <VisibilityOff titleAccess="Incognito Off" onClick={() => { toggleIncognito(); }} />
                ) : (
                    <Visibility titleAccess="Incognito On" onClick={() => { toggleIncognito(); }} />
                )}
                <MoreVert titleAccess="More Options" onClick={handleClick} />
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
                    <MenuOption onClick={handleNameClick}>Profile</MenuOption>
                    <MenuOption onClick={clearChat}>Clear Chat</MenuOption>
                </Menu>
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