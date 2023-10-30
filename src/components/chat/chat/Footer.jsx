import { useEffect, useState } from "react";

import { Box, InputBase, styled } from "@mui/material"

import { EmojiEmotionsOutlined, AttachFile, Send } from "@mui/icons-material";

import { uploadFile } from "../../../service/api";

import EmojiPicker from "./EmojiPicker";

const Container = styled(Box)`
    height: 55px;
    background: #ededed;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 15px;
    &  > * {
        margin: 5px;
        color: #919191;
    }
`;

const Search = styled(Box)`
    border-radius: 18px;
    background-color: #FFFFFF;
    width: calc(94% - 100px);
`;

const InputField = styled(InputBase)`
    width: 100%;
    padding: 20px;
    padding-left: 25px;
    font-size: 14px;
    height: 20px;
    width: 100%;
`;


const Footer = ({ sendText, setValue, value, file, setFile, setImage }) => {

    const [hasText, setHasText] = useState(false);
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    useEffect(() => {
        const getImage = async () => {
            if (file) {
                const data = new FormData();
                data.append("name", file.name);
                data.append("file", file);

                const response = await uploadFile(data);
                setImage(response.data);
            }
        }
        getImage();
    }, [file])

    const onFileChange = (e) => {
        setValue(e.target.files[0].name);
        setFile(e.target.files[0]);
    }

    const handleSend = () => {
        if (value.trim() !== '') {
            sendText({ keyCode: 13 });
        }
        setHasText(false)
    }

    const handleEmojiClick = () => {
        setEmojiPickerOpen(!emojiPickerOpen);
    }

    const closeEmojiPicker = () => {
        setEmojiPickerOpen(false);
    };

    return (
        <Container>
            <EmojiEmotionsOutlined style={{
                cursor: 'pointer'
            }} onClick={handleEmojiClick} />

            <label htmlFor="fileInput" >
                <AttachFile style={{
                    cursor: 'pointer'
                }} />
            </label>

            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={(e) => { onFileChange(e); setHasText(e.target.value.trim() !== ''); }}
            />
            <Search>
                <InputField
                    placeholder="Type a Message"
                    onChange={e => { setValue(e.target.value); setHasText(e.target.value.trim() !== ''); }}
                    onKeyPress={(e) => sendText(e)}
                    value={value}
                />
                {emojiPickerOpen && (
                    <EmojiPicker
                        onSelect={(emoji) => {setValue(value + emoji); setHasText(true);}}
                        onClose={closeEmojiPicker}
                    />
                )}
            </Search>

            {hasText ? (
                <Send
                    style={{ cursor: 'pointer', color: 'green' }}
                    onClick={handleSend}
                />
            ) : <Send
                style={{ cursor: 'pointer', color: 'grey' }}
            />}
        </Container>
    )
}

export default Footer