import { useContext, useEffect, useState } from "react";

import { Box, Skeleton, Typography, styled, Badge } from "@mui/material";

import { AccountContext } from "../../../context/AccountProvider";
import { setConversation, getConversation } from "../../../service/api";
import { emptyProfilePicture } from "../../../constants/data";
import { formatDate, formatJoinedDate, getProfilePictureUrl, setFallbackImage } from "../../../utils/common-utils";

const Component = styled(Box)`
    min-height: 58px;
    display: flex;
    padding: 8px 0;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;

    &:hover {
        background-color: #f0f2f5;
        padding-left: 8px;
      }
`;

const NameText = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'hasUnread'
})(({ hasUnread }) => ({
    fontSize: 15,
    lineHeight: 1.25,
    fontWeight: hasUnread ? 700 : 500,
    color: hasUnread ? '#111b21' : 'inherit'
}));

const Image = styled('img')({
    width: 44,
    height: 44,
    objectFit: 'cover',
    borderRadius: '50%',
    display: 'block'
});

const AvatarSlot = styled(Box)`
    width: 72px;
    min-width: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`

const StyledBadge = styled(Badge)(() => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#ff4757',
        color: '#ff4757',
        boxShadow: `0 0 0 2px #fff`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const Container = styled(Box)`
    display: flex;
    align-items: center;
`;

const Timestamp = styled(Typography)`
    font-size: 12px;
    margin-left: auto;
    color: #00000099;
    margin-right: 20px;
`;

const Text = styled(Typography)`
    display: block;
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
`;

const PreviewText = styled(Text, {
    shouldForwardProp: (prop) => prop !== 'hasUnread'
})(({ hasUnread }) => ({
    fontWeight: hasUnread ? 700 : 400,
    color: hasUnread ? '#111b21' : 'rgba(0, 0, 0, 0.6)'
}));

const JoinedText = styled(Typography)`
    display: block;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    margin-top: 2px;
`;

const OnlineBadge = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isOnline'
})(({ isOnline }) => ({
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: isOnline ? '#4caf50' : '#9e9e9e',
    border: '2px solid white',
    bottom: '0',
    right: '0',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
}));

const UnreadCount = styled(Box)`
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 999px;
    background: #00a884;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
`;

const Conversation = ({ user, lastMessage, unreadCount = 0, conversationUpdatedAt }) => {
    const url = getProfilePictureUrl(user, emptyProfilePicture);

    const { setPerson, account, newMessageFlag, updateMessage, activeUsers } = useContext(AccountContext)
    
    const isUserOnline = activeUsers?.find(u => u.sub === user.sub);
    const hasUnread = unreadCount > 0;

    const [message, setMessage] = useState(lastMessage ? {
        text: lastMessage.text,
        timestamp: lastMessage.createdAt || conversationUpdatedAt
    } : {});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    }, [url]);

    useEffect(() => {
        if (lastMessage) {
            setMessage({
                text: lastMessage.text,
                timestamp: lastMessage.createdAt || conversationUpdatedAt
            });
            return;
        }

        const getConversationMessage = async () => {
            const data = await getConversation({ senderId: account.sub, receiverId: user.sub });
            setMessage({ text: data?.message, timestamp: data?.updatedAt });
        }
        getConversationMessage();
    }, [account.sub, user.sub, lastMessage, conversationUpdatedAt, newMessageFlag, updateMessage]);

    const getUser = async () => {
        setPerson(user)
        await setConversation({ senderId: account.sub, receiverId: user.sub })
    }

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = (event) => {
        setFallbackImage(event, emptyProfilePicture);
        setIsLoading(false);
    };

    return (
        <Component onClick={getUser}>
            <AvatarSlot>
                {isLoading && <Skeleton variant="circular" width={44} height={44} />}
                <StyledBadge badgeContent={0} overlap="circular">
                    <Box style={{ position: 'relative' }}>
                        <Image
                            src={url}
                            alt="dp"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            referrerPolicy="no-referrer"
                            style={{ display: isLoading ? 'none' : 'block' }}
                        />
                        <OnlineBadge isOnline={isUserOnline} />
                    </Box>
                </StyledBadge>
            </AvatarSlot>
            <Box style={{ width: '100%', minWidth: 0, paddingRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Container>
                        <NameText hasUnread={hasUnread}>{user.name}</NameText>
                        {
                            message?.text &&
                            <Timestamp>{formatDate(message?.timestamp)}</Timestamp>
                        }
                    </Container>
                    <Box>
                        <PreviewText hasUnread={hasUnread}>
                            {message?.text?.includes('whatsapp-backend')
                                ? 'Media'
                                : message && message.text
                                    ? message.text.length > 35
                                        ? message.text.substring(0, 35) + '...'
                                        : message.text
                                    : ''}
                        </PreviewText>
                        {user.joinedAt && (
                            <JoinedText>Joined {formatJoinedDate(user.joinedAt)}</JoinedText>
                        )}
                    </Box>
                </Box>
                {hasUnread && <UnreadCount>{unreadCount > 99 ? '99+' : unreadCount}</UnreadCount>}
            </Box>
        </Component>
    )
}

export default Conversation;

