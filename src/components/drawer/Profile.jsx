import { useContext, useEffect, useState } from "react";
import { Box, Button, TextField, styled, Typography } from "@mui/material"

import { AccountContext } from "../../context/AccountProvider";
import { emptyProfilePicture } from "../../constants/data";
import { getProfilePictureUrl, setFallbackImage } from "../../utils/common-utils";
import { updateUserStatus } from "../../service/api";

const ImageContainer = styled(Box)`
    display: flex;
    justify-content: center;
`;

const Image = styled('img') ({
    width: 200,
    height: 200,
    borderRadius: '50%',
    padding: '25px 0'
});

const BoxWrapper = styled(Box)`
    background: #FFFFFF;
    padding: 12px 30px 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    & > p:first-of-type {
        font-size: 13px;
        color: #009688;
        font-weight: 200;
    };
    & > p:last-of-type {
        margin: 10px 0;
        color: #4A4A4A;
    }
`;

const StatusWrapper = styled(Box)`
    background: #FFFFFF;
    padding: 12px 30px 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const Label = styled(Typography)`
    font-size: 13px;
    color: #009688;
    font-weight: 200;
`;

const StatusText = styled(Typography)`
    margin: 10px 0 4px;
    color: #4A4A4A;
    min-height: 20px;
    word-break: break-word;
`;

const Actions = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 10px;
`;

const ButtonGroup = styled(Box)`
    display: flex;
    gap: 8px;
`;

const DescriptionContainer = styled(Box)`
    padding: 15px 20px 28px 30px;
    & > p {
        color: #8696a0;
        font-size: 13px;
    }
`;


const Profile = ()=> {
    const { account, setAccount } = useContext(AccountContext)
    const picture = getProfilePictureUrl(account, emptyProfilePicture);
    const [statusMessage, setStatusMessage] = useState(account?.about || '');
    const [draftStatus, setDraftStatus] = useState(account?.about || '');
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [isSavingStatus, setIsSavingStatus] = useState(false);
    const [statusError, setStatusError] = useState('');

    useEffect(() => {
        setStatusMessage(account?.about || '');
        setDraftStatus(account?.about || '');
    }, [account?.about]);

    const startEditingStatus = () => {
        setDraftStatus(statusMessage);
        setStatusError('');
        setIsEditingStatus(true);
    };

    const cancelEditingStatus = () => {
        setDraftStatus(statusMessage);
        setStatusError('');
        setIsEditingStatus(false);
    };

    const saveStatus = async () => {
        if (!account?.sub) return;

        try {
            setIsSavingStatus(true);
            setStatusError('');
            const updatedAccount = await updateUserStatus({
                sub: account.sub,
                about: draftStatus
            });

            setAccount(updatedAccount);
            setStatusMessage(updatedAccount?.about || '');
            setIsEditingStatus(false);
        } catch (error) {
            setStatusError(error.message || 'Could not update status message.');
        } finally {
            setIsSavingStatus(false);
        }
    };

    return (
        <>
            <ImageContainer>
                <Image
                    src={picture}
                    alt="displaypicture"
                    onError={(event) => setFallbackImage(event, emptyProfilePicture)}
                    referrerPolicy="no-referrer"
                />
            </ImageContainer>
            <BoxWrapper>
                <Typography>Your name</Typography>
                <Typography>{account.name}</Typography>
            </BoxWrapper>
            <DescriptionContainer>
                <Typography>This is not your username or pin. This name will be visible to your WhatsApp contacts.</Typography>
            </DescriptionContainer>
            <StatusWrapper>
                <Label>About</Label>
                {isEditingStatus ? (
                    <>
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            maxRows={4}
                            value={draftStatus}
                            onChange={(event) => setDraftStatus(event.target.value.slice(0, 140))}
                            placeholder="Add a status message"
                            variant="standard"
                            disabled={isSavingStatus}
                            inputProps={{ maxLength: 140 }}
                        />
                        <Actions>
                            <Typography variant="caption" color={statusError ? 'error' : 'text.secondary'}>
                                {statusError || `${draftStatus.length}/140`}
                            </Typography>
                            <ButtonGroup>
                                <Button size="small" onClick={cancelEditingStatus} disabled={isSavingStatus}>
                                    Cancel
                                </Button>
                                <Button size="small" variant="contained" onClick={saveStatus} disabled={isSavingStatus}>
                                    Save
                                </Button>
                            </ButtonGroup>
                        </Actions>
                    </>
                ) : (
                    <>
                        <StatusText>{statusMessage || 'No status message set.'}</StatusText>
                        <Button size="small" onClick={startEditingStatus}>
                            {statusMessage ? 'Edit status' : 'Add status'}
                        </Button>
                    </>
                )}
            </StatusWrapper>
            <DescriptionContainer>
                <Typography>Your status message is visible to people who open your profile.</Typography>
            </DescriptionContainer>
            <BoxWrapper>
                <Typography>Email</Typography>
                <Typography>{account.email}</Typography>
            </BoxWrapper>
        </>
    )
}

export default Profile;
