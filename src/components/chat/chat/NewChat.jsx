import React from "react";
import { Box, Typography, Button, styled } from "@mui/material";

const style = {
    height: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
}

const Header = styled(Typography)({
    marginBottom: '20px'
})

const Helper = styled(Typography)({
    marginBottom: '40px'
})

const NewChat = () => {
    return (
        <Box
            style={style}
        >
            <Header variant="h4">
                Welcome to the Chat
            </Header>
            <Helper variant="body1">
                Start the conversation.
            </Helper>
            <Button
                variant="contained"
                color="success"
                size="large"
            >
                Send Your First Message
            </Button>
        </Box>
    );
};

export default NewChat;