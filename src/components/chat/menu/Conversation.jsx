import { useContext, useEffect, useState } from "react";

import { Box, Typography, styled } from "@mui/material";

import { AccountContext } from "../../../context/AccountProvider";
import { setConversation, getConversation } from "../../../service/api";
import { emptyProfilePicture } from "../../../constants/data";
import { formatDate } from "../../../utils/common-utils";
import Loader from "../../Loader/Loader";

const Component = styled(Box)`
    height: 45px;
    display: flex;
    padding: 13px 0;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #e0f7fa;
      }
`;

const Image = styled('img')({
    width: 50,
    height: 50,
    objectFit: 'cover',
    borderRadius: '50%',
    padding: '0 14px'
});

const Container = styled(Box)`
    display: flex;
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
    font-size: 14px;
`;

const Conversation = ({ user }) => {
    const url = user.picture || emptyProfilePicture;

    const { setPerson, account, newMessageFlag, updateMessage } = useContext(AccountContext)

    const [message, setMessage] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getConversationMessage = async () => {
            const data = await getConversation({ senderId: account.sub, receiverId: user.sub });
            setMessage({ text: data?.message, timestamp: data?.updatedAt });
        }
        getConversationMessage();
    }, [newMessageFlag, updateMessage]);

    const getUser = async () => {
        setPerson(user)
        await setConversation({ senderId: account.sub, receiverId: user.sub })
    }

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    return (
        <Component onClick={getUser}>
            <Box>
                {isLoading && <Loader />}
                <Image src={url} alt="dp" onLoad={handleImageLoad} />
            </Box>
            <Box style={{ width: '100%' }}>
                <Container>
                    <Typography>{user.name}</Typography>
                    {
                        message?.text &&
                        <Timestamp>{formatDate(message?.timestamp)}</Timestamp>
                    }
                </Container>
                <Box>
                    <Text>{message?.text?.includes('localhost') ? 'media' : message.text}</Text>
                </Box>
            </Box>
        </Component>
    )
}

export default Conversation;

