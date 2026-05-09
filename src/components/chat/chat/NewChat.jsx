import React from "react";
import { Box, Typography, styled } from "@mui/material";

const Wrapper = styled(Box)`
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding: 32px 24px;
    color: #2b2b2b;
`

const Header = styled(Typography)`
    margin-bottom: 20px;
    font-weight: 700;
`

const Helper = styled(Typography)`
    margin-bottom: 32px;
    max-width: 420px;
    color: #5f6368;
`

const NewChat = () => {
    return (
        <Wrapper>
            <Header variant="h4">
                Ready when you are
            </Header>
            <Helper variant="body1">
                Select a conversation from the left or type a message below to start chatting. Attach images and files securely with the paperclip icon.
            </Helper>
        </Wrapper>
    );
};

export default NewChat;
