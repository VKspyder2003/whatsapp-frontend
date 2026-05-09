import { useContext } from "react";

import { Box, Typography, styled } from "@mui/material";
import { GetApp } from "@mui/icons-material";

import { downloadMedia, formatDate } from "../../../utils/common-utils";

import { AccountContext } from "../../../context/AccountProvider";

import { iconPDF } from '../../../constants/data';

const Wrapper = styled(Box)`
    background: #ffffff;
    padding: 10px 14px;
    max-width: 60%;
    width: fit-content;
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    word-break: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    animation: slideInLeft 0.3s ease-out;
    margin: 6px 0;
    transition: all 0.2s ease;
    
    &:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
`;

const Own = styled(Box)`
    background: #dcf8c6;
    padding: 10px 14px;
    max-width: 60%;
    width: fit-content;
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    word-break: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    animation: slideInRight 0.3s ease-out;
    margin: 6px 0 6px auto;
    transition: all 0.2s ease;
    
    &:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
`;

const Text = styled(Typography)`
    font-size: 14px;
    padding: 0;
    color: #2c2c2c;
    line-height: 1.4;
    word-wrap: break-word;
`;

const Time = styled(Typography)`
    font-size: 11px;
    color: #919191;
    margin-top: 6px;
    word-break: keep-all;
    margin-top: auto;
    align-self: flex-end;
`;

const Message = ({ message }) => {

    const { account } = useContext(AccountContext);

    return (
        <>
            {
                account.sub === message.senderId ?
                    <Own>
                        {
                            message.type === 'file' ? <ImageMessage message={message} /> : <TextMessage message={message} />
                        }
                    </Own>
                    :
                    <Wrapper>
                        {
                            message.type === 'file' ? <ImageMessage message={message} /> : <TextMessage message={message} />
                        }
                    </Wrapper>

            }
        </>
    )
}


const TextMessage = ({ message }) => {

    return (
        <>
            <Text>{message.text}</Text>
            <Time>{formatDate(message.createdAt)}</Time>
        </>
    )
}

const ImageMessage = ({ message }) => {

    return (
        <div style={{ position: 'relative' }}>
            {
                message?.text?.includes('.pdf') ?
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 0'
                    }}>
                        <img src={iconPDF} alt="pdf-icon" style={{
                            width: 60,
                            height: 60,
                            objectFit: 'contain'
                        }} />
                        <div>
                            <Typography style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: '#2c2c2c',
                                wordBreak: 'break-word'
                            }}>
                                {message.text.split("/").pop()}
                            </Typography>
                            <Typography style={{
                                fontSize: 11,
                                color: '#999',
                                marginTop: '4px'
                            }}>
                                PDF Document
                            </Typography>
                        </div>
                    </div>
                    :
                    <img style={{
                        width: 300,
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                            transform: 'scale(1.02)'
                        }
                    }} src={message.text} alt={message.text} />
            }
            <Box style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                display: 'flex',
                gap: '6px'
            }}>
                <GetApp
                    onClick={(e) => downloadMedia(e, message.text)}
                    fontSize='small'
                    style={{
                        padding: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: '#1b8e5c',
                        '&:hover': {
                            backgroundColor: '#ffffff',
                            transform: 'scale(1.1)'
                        }
                    }}
                    titleAccess="Download"
                />
            </Box>
        </div>
    )
}

export default Message;
