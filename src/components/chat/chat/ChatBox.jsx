import { useContext, useState, useEffect } from "react";

import { Box, styled } from "@mui/material";

import { AccountContext } from "../../../context/AccountProvider";

import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import Loader from "../../Loader/Loader";

import { getConversation, markMessagesRead, setConversation as createConversation } from "../../../service/api";

const Container = styled(Box)`
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
`

const LoadingArea = styled(Box)`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(${'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'});
    background-size: 100px 100px;
`

const ChatBox = () => {

    const { person, account, socket, setReadConversationId } = useContext(AccountContext)

    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isIncognito, setIsIncognito] = useState(false);
    const [isConversationLoading, setIsConversationLoading] = useState(false);

    useEffect(() => {
        // Reset read conversation when switching chats
        return () => {
            setReadConversationId(null);
        };
    }, [person?.sub, setReadConversationId]);

    useEffect(() => {
        const socketInstance = socket.current;

        if (!socketInstance || !account?.sub || !person?.sub) return;

        const payload = { senderId: account.sub, receiverId: person.sub };
        socketInstance.emit('getIncognitoState', payload);

        const handleIncognitoUpdate = ({ participants, isIncognito: nextIncognitoState }) => {
            const isCurrentConversation = participants?.includes(account.sub) && participants?.includes(person.sub);

            if (isCurrentConversation) {
                setIsIncognito(Boolean(nextIncognitoState));
            }
        };

        socketInstance.on('incognitoUpdated', handleIncognitoUpdate);

        return () => {
            socketInstance.off('incognitoUpdated', handleIncognitoUpdate);
        };
    }, [account?.sub, person?.sub, socket]);

    useEffect(() => {
        let isMounted = true;

        const getConversationDetails = async () => {
            if (!account?.sub || !person?.sub) {
                return;
            }

            setIsConversationLoading(true);
            setMessages([]);
            setIsIncognito(false);

            try {
                const members = { senderId: account.sub, receiverId: person.sub };
                let data = await getConversation(members);

                if (!data?._id) {
                    await createConversation(members);
                    data = await getConversation(members);
                }

                if (isMounted) {
                    setConversation(data || {});
                }

                if (data?._id) {
                    await markMessagesRead({
                        conversationId: data._id,
                        receiverId: account.sub
                    });
                    setReadConversationId(data._id);
                }
            } catch (error) {
                console.error('Failed to prepare conversation:', error);
                if (isMounted) {
                    setConversation({});
                }
            } finally {
                if (isMounted) {
                    setIsConversationLoading(false);
                }
            }
        }

        getConversationDetails();

        return () => {
            isMounted = false;
        }
    }, [account?.sub, person?.sub]);

    return (
        <Container>
            <ChatHeader person={person} messages={messages} setMessages={setMessages} isIncognito={isIncognito} setIsIncognito={setIsIncognito} />
            {isConversationLoading ? (
                <LoadingArea>
                    <Loader fill message={`Opening chat with ${person.name}...`} />
                </LoadingArea>
            ) : (
                <Messages person={person} conversation={conversation} messages={messages} setMessages={setMessages} isIncognito={isIncognito} />
            )}
        </Container>
    )
}

export default ChatBox;
