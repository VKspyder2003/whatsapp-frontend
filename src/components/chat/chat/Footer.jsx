import { useEffect, useState } from "react";

import { Box, InputBase, styled, Typography, CircularProgress, Tooltip, IconButton } from "@mui/material"

import { EmojiEmotionsOutlined, AttachFile, Send, Close, InsertDriveFile, ErrorOutline } from "@mui/icons-material";

import { uploadFile } from "../../../service/api";

import EmojiPicker from "./EmojiPicker";

const Container = styled(Box)`
    min-height: 72px;
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    gap: 12px;
    position: relative;
    border-top: 1px solid #e0e0e0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
`;

const InputContainer = styled(Box)`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
`;

const Search = styled(Box)`
    border-radius: 24px;
    background-color: #ffffff;
    flex: 1;
    min-width: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1.5px solid #e0e0e0;
    transition: all 0.2s ease;
    
    &:hover {
        border-color: #d0d0d0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    &:focus-within {
        border-color: #1b8e5c;
        box-shadow: 0 0 0 3px rgba(27, 142, 92, 0.1);
    }
`;

const InputField = styled(InputBase)`
    width: 100%;
    padding: 12px 20px;
    font-size: 14px;
    color: #2b2b2b;
    
    & .MuiInputBase-input {
        padding: 0;
        
        &::placeholder {
            color: #9e9e9e;
            opacity: 1;
        }
    }
`;

const HelperText = styled(Typography)`
    font-size: 12px;
    color: #d32f2f;
    margin: 0 18px 8px;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const FileInfo = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background-color: #f9f9f9;
    border-top: 1px solid #e0e0e0;
    border-radius: 0 0 24px 24px;
    gap: 8px;
`;

const ActionButton = styled(IconButton)`
    transition: all 0.2s ease;
    color: #1b8e5c;
    padding: 8px;
    
    &:hover {
        background-color: rgba(27, 142, 92, 0.08);
        transform: scale(1.1);
    }
    
    &:active {
        transform: scale(0.95);
    }
`;

const SendButton = styled(IconButton)`
    transition: all 0.2s ease;
    color: #1b8e5c;
    width: 44px;
    height: 44px;
    padding: 0;
    flex: 0 0 44px;
    
    &:hover:not(:disabled) {
        background-color: rgba(27, 142, 92, 0.08);
        transform: scale(1.04);
    }
    
    &:disabled {
        color: #bdbdbd;
        cursor: not-allowed;
    }
    
    &:active:not(:disabled) {
        transform: scale(0.95);
    }
`;

const Footer = ({ sendText, setValue, value, file, setFile, setImage }) => {

    const [hasText, setHasText] = useState(false);
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileError, setFileError] = useState('');
    const [fileName, setFileName] = useState('');

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

    useEffect(() => {
        const getImage = async () => {
            if (file) {
                setUploading(true);
                setFileError('');
                try {
                    const data = new FormData();
                    data.append("name", file.name);
                    data.append("file", file);

                    const response = await uploadFile(data);
                    setImage(response.data);
                    setFileName(file.name);
                } catch (error) {
                    setFileError('Unable to upload file. Please try a different file.');
                    setFile(null);
                    setValue('');
                } finally {
                    setUploading(false);
                }
            }
        }
        getImage();
    }, [file])

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            return;
        }

        if (!allowedTypes.includes(selectedFile.type)) {
            setFileError('Only JPG, PNG, and PDF files are supported.');
            setFile(null);
            setValue('');
            setFileName('');
            return;
        }

        setFileError('');
        setValue(selectedFile.name);
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setHasText(true);
    }

    const handleSend = () => {
        if (hasText || fileName) {
            sendText('send');
        }
        setHasText(false)
    }

    const handleEmojiClick = () => {
        setEmojiPickerOpen(!emojiPickerOpen);
    }

    const closeEmojiPicker = () => {
        setEmojiPickerOpen(false);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFileName('');
        setValue('');
        setFileError('');
    };

    const canSend = (value.trim() !== '' || fileName) && !uploading && !fileError;

    return (
        <Container>
            <InputContainer>
                <Tooltip title="Add emoji" arrow>
                    <ActionButton
                        size="small"
                        onClick={handleEmojiClick}
                        className={emojiPickerOpen ? 'active' : ''}
                    >
                        <EmojiEmotionsOutlined />
                    </ActionButton>
                </Tooltip>

                <Tooltip title="Attach file" arrow>
                    <ActionButton
                        size="small"
                        component="label"
                    >
                        <AttachFile />
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            onChange={onFileChange}
                        />
                    </ActionButton>
                </Tooltip>

                <Search>
                    <InputField
                        placeholder="Type a message..."
                        onChange={e => {
                            setValue(e.target.value);
                            setHasText(e.target.value.trim() !== '');
                            if (file) {
                                setFile(null);
                                setFileName('');
                            }
                        }}
                        onKeyDown={(e) => sendText(e)}
                        value={value}
                        inputProps={{ 'aria-label': 'type a message' }}
                    />
                    {emojiPickerOpen && (
                        <EmojiPicker
                            onSelect={(emoji) => {
                                setValue(value + emoji);
                                setHasText(true);
                            }}
                            onClose={closeEmojiPicker}
                        />
                    )}
                    {fileName && (
                        <FileInfo>
                            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                <Typography variant="caption" style={{ color: '#4a4a4a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <InsertDriveFile fontSize="inherit" />
                                    {fileName}
                                </Typography>
                                {uploading && <CircularProgress size={14} />}
                            </Box>
                            <Close
                                fontSize="small"
                                onClick={handleRemoveFile}
                                style={{ cursor: 'pointer', color: '#999' }}
                            />
                        </FileInfo>
                    )}
                    {fileError && (
                        <HelperText>
                            <ErrorOutline fontSize="small" />
                            <span>{fileError}</span>
                        </HelperText>
                    )}
                </Search>
            </InputContainer>

            <Tooltip title={canSend ? "Send message" : "Type a message first"} arrow>
                <span>
                    <SendButton
                        onClick={handleSend}
                        disabled={!canSend}
                        size="small"
                    >
                        <Send />
                    </SendButton>
                </span>
            </Tooltip>
        </Container>
    )
}

export default Footer

