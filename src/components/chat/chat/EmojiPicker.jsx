import React from "react";
import { Popover, Box, IconButton } from "@mui/material";

import { Close } from "@mui/icons-material";

const EmojiPicker = ({ onSelect, onClose }) => {
    const emojis = ["😀", "😄", "😆", "😅", "😂", "🤣", "😊", "😍", "😎", "😇"];

    return (
        <Popover
            open={true}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
            <Box>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
                {emojis.map((emoji, index) => (
                    <span
                        key={index}
                        style={{ fontSize: "24px", cursor: "pointer", padding: "5px" }}
                        onClick={() => onSelect(emoji)}
                    >
                        {emoji}
                    </span>
                ))}
            </Box>
        </Popover>
    );
};

export default EmojiPicker;
