import { useState, useEffect, useContext, useRef } from "react";

import { Box, styled, Typography } from "@mui/material";

import { AccountContext } from '../../../context/AccountProvider'

import Footer from "./Footer";
import Loader from "../../Loader/Loader";

import { getMessages, markMessagesRead, newMessage } from "../../../service/api";
import Message from "./Message";
import NewChat from "./NewChat";


const Wrapper = styled(Box)`
    background-image: url(${'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'});
    background-size: 100px 100px;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
`

const Component = styled(Box)`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 16px 50px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    
    &::-webkit-scrollbar {
        width: 8px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #999;
    }
`

const Container = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isOwn'
})(({ isOwn }) => ({
    width: '100%',
    display: 'flex',
    justifyContent: isOwn ? 'flex-end' : 'flex-start',
    alignItems: 'flex-start'
}))

const DateSeparator = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0 8px 0;
    gap: 12px;
    
    &::before,
    &::after {
        content: '';
        flex: 1;
        height: 1px;
        background-color: rgba(0, 0, 0, 0.1);
    }
`;




const Messages = ({ person, conversation, messages, setMessages, isIncognito }) => {

    const [value, setValue] = useState('')
    const [file, setFile] = useState(null)
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const scrollRef = useRef();
    const activeChatRef = useRef({});

    const { account, socket, newMessageFlag, setNewMessageFlag, setUpdateMessage } = useContext(AccountContext)

    useEffect(() => {
        activeChatRef.current = {
            accountSub: account?.sub,
            personSub: person?.sub
        };
    }, [account?.sub, person?.sub]);

    useEffect(() => {
        const handleIncoming = (data) => {
            const { accountSub, personSub } = activeChatRef.current;
            const isCurrentConversation = data.senderId === personSub && data.receiverId === accountSub;

            if (isCurrentConversation) {
                setMessages((prev) => [
                    ...prev,
                    {
                        ...data,
                        createdAt: data.createdAt || Date.now()
                    }
                ]);

                if (data.conversationId) {
                    markMessagesRead({
                        conversationId: data.conversationId,
                        receiverId: accountSub
                    }).finally(() => setUpdateMessage(prev => !prev));
                }
            }
        }

        socket.current?.on('getMessage', handleIncoming);
        return () => {
            socket.current?.off('getMessage', handleIncoming);
        }
    }, [socket, setMessages, setUpdateMessage]);

    useEffect(() => {
        const getMessageDetails = async () => {
            try {
                if (conversation && conversation._id) {
                    const data = await getMessages(conversation._id);
                    setMessages(data || []);
                }
            } catch (error) {
                console.error('Failed to load messages:', error);
            } finally {
                setIsLoading(false)
            }
        }

        setIsLoading(true);
        if (conversation && conversation._id) {
            getMessageDetails();
        } else {
            setIsLoading(false);
        }
    }, [person._id, conversation?._id, newMessageFlag]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendText = async (event) => {
        const isEnter = event === 'send' || event?.key === 'Enter' || event?.keyCode === 13 || event?.which === 13;
        if (!isEnter) {
            return;
        }

        const trimmedValue = value?.trim() || '';
        const isFileMessage = !!file;
        const messageText = isFileMessage ? image : trimmedValue;

        if (!messageText || messageText.trim() === '') {
            return;
        }

        const message = {
            senderId: account.sub,
            receiverId: person.sub,
            conversationId: conversation?._id,
            type: isFileMessage ? 'file' : 'text',
            text: messageText,
            createdAt: Date.now(),
            isIncognito
        }

        if (isIncognito) {
            message._id = `local-${Date.now()}`;
        }

        try {
            socket.current?.emit('sendMessage', message);
            if (!isIncognito) {
                const response = await newMessage(message);
                if (response?.data) {
                    setMessages((prev) => [...prev, response.data]);
                }
                setNewMessageFlag(prev => !prev)
            } else {
                setMessages((prev) => [...prev, message]);
            }
            setValue('')
            setFile(null)
            setImage('')
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

    const getDateSeparator = (messageDate) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const msgDate = new Date(messageDate);
        const isToday = msgDate.toDateString() === today.toDateString();
        const isYesterday = msgDate.toDateString() === yesterday.toDateString();

        if (isToday) return 'Today';
        if (isYesterday) return 'Yesterday';
        return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: msgDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
    };

    const renderMessagesWithDateSeparators = () => {
        let lastDate = null;
        const result = [];

        messages.forEach((message, index) => {
            const currentDate = new Date(message.createdAt).toDateString();

            if (currentDate !== lastDate) {
                result.push(
                    <DateSeparator key={`date-${currentDate}`}>
                        <Typography variant="caption" style={{ color: '#999', fontSize: '12px', fontWeight: 500 }}>
                            {getDateSeparator(message.createdAt)}
                        </Typography>
                    </DateSeparator>
                );
                lastDate = currentDate;
            }

            const isOwn = account.sub === message.senderId;

            result.push(
                <Container ref={index === messages.length - 1 ? scrollRef : null} key={message?._id || index} isOwn={isOwn}>
                    <Message message={message} />
                </Container>
            );
        });

        return result;
    };

    return (
        <Wrapper>
            {isLoading ? (
                <Box style={{ flex: 1, minHeight: 0, display: "flex" }}>
                    <Loader fill message={`Loading messages with ${person.name}...`} />
                </Box>
            ) : (
                messages.length > 0 ? (
                    <Component>
                        {renderMessagesWithDateSeparators()}
                    </Component>
                ) : (
                    <NewChat />
                ))
            }
            <Footer
                sendText={sendText}
                setValue={setValue}
                value={value}
                file={file}
                setFile={setFile}
                setImage={setImage}
            />
        </Wrapper>
    )
}

export default Messages;
