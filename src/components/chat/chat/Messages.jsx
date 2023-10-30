import { useState, useEffect, useContext, useRef } from "react";

import { Box, styled, CircularProgress } from "@mui/material";

import { AccountContext } from '../../../context/AccountProvider'

import Footer from "./Footer";

import { getMessages, newMessage } from "../../../service/api";
import Message from "./Message";
import NewChat from "./NewChat";


const Wrapper = styled(Box)`
    background-image: url(${'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'});
    height: 80vh;
`

const Component = styled(Box)`
    height: 80vh;
    overflow-y: scroll;
`

const Container = styled(Box)(
    {
        padding: '1px 50px'
    }
)


const Messages = ({ person, conversation, messages, setMessages, isIncognito }) => {

    const [value, setValue] = useState('')
    const [incomingMessage, setIncomingMessage] = useState(null);
    const [file, setFile] = useState()
    const [image, setImage] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const scrollRef = useRef();

    const { account, socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext)

    useEffect(() => {
        socket.current.on('getMessage', data => {
            setIncomingMessage({
                ...data,
                createdAt: Date.now()
            })
        })
    }, []);

    useEffect(() => {
        const getMessageDetails = async () => {
            try {
                if (conversation && conversation._id) { 
                    let data = await getMessages(conversation._id);
                    setMessages(data);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
            // console.log(data)
        }
        conversation && conversation._id && getMessageDetails();
    }, [person._id, conversation?._id, newMessageFlag]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        incomingMessage && conversation?.members?.includes(incomingMessage.senderId) &&
            setMessages((prev) => [...prev, incomingMessage]);

    }, [incomingMessage, conversation]);

    const sendText = async (e) => {
        const code = e.keyCode || e.which;
        if (code === 13) {
            let message = []
            if (!file) {
                message = {
                    senderId: account.sub,
                    receiverId: person.sub,
                    conversationId: conversation._id,
                    type: 'text',
                    text: value
                }
            } else {
                message = {
                    senderId: account.sub,
                    receiverId: person.sub,
                    conversationId: conversation._id,
                    type: 'file',
                    text: image
                }
            }

            // console.log(message)
            if (!isIncognito) {
                if (message?.text.trimEnd() !== '') {
                    socket.current.emit('sendMessage', message);
                    console.log(message)
                    await newMessage(message);
                }
            } else {
                if (message?.text.trimEnd() !== '') {
                    socket.current.emit('sendMessage', message);
                }
            }

            setNewMessageFlag(prev => !prev)
            setValue('');
            setFile('');
            setImage('');
        }
    }

    return (

        <Wrapper>
            {isLoading ? (
                <Box
                    style={{
                        height: "80vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                messages.length > 0 ? (
                    <Component>
                        {messages && messages.map((message, index) => (
                            <Container ref={index === messages.length - 1 ? scrollRef : null} key={ message?._id }>
                                <Message message={message} />
                            </Container>
                        ))}
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