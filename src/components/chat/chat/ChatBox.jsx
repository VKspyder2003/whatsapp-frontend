import { useContext, useState, useEffect } from "react";

import { Box } from "@mui/material";

import { AccountContext } from "../../../context/AccountProvider";

import ChatHeader from "./ChatHeader";
import Messages from "./Messages";

import { getConversation } from "../../../service/api";

const ChatBox = () => {

    const { person, account } = useContext(AccountContext)

    const [conversation, setConversation] = useState({});
    const [messages, setMessages] = useState([]);
    const [isIncognito, setIsIncognito] = useState(false);

    useEffect(() => {
        const getConversationDetails = async () => {
            let data = await getConversation({ senderId: account.sub, receiverId: person.sub });
            // console.log(data)
            setConversation(data);
        }
        getConversationDetails();
    }, [person.sub]);

    return (
        <Box style={{ height: '75%' }}>
            <ChatHeader person={person} messages={messages} setMessages={setMessages} isIncognito={isIncognito} setIsIncognito={setIsIncognito} />
            <Messages person={person} conversation={conversation} messages={messages} setMessages={setMessages} isIncognito={isIncognito} />
        </Box>
    )
}

export default ChatBox;