import { useContext } from 'react';
import { Dialog, Box, Button, Typography, Avatar, Divider, Chip, styled } from '@mui/material';
import { Close, Schedule, PersonAddAlt } from '@mui/icons-material';
import { AccountContext } from '../../context/AccountProvider';
import { defaultProfilePicture } from '../../constants/data';
import { getProfilePictureUrl } from '../../utils/common-utils';

const ProfileCard = styled(Box)`
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const HeaderSection = styled(Box)`
    background: linear-gradient(135deg, #1b8e5c 0%, #15704c 100%);
    padding: 32px 24px 40px;
    color: white;
    text-align: center;
    position: relative;
`;

const ProfileImage = styled(Avatar)`
    width: 120px !important;
    height: 120px !important;
    border: 5px solid white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    margin: 0 auto 16px;
    font-size: 48px !important;
`;

const ContentSection = styled(Box)`
    padding: 32px 24px;
`;

const InfoItem = styled(Box)`
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
    
    &:last-child {
        margin-bottom: 0;
    }
`;

const InfoIcon = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: rgba(27, 142, 92, 0.1);
    border-radius: 50%;
    color: #1b8e5c;
    flex-shrink: 0;
    
    & svg {
        font-size: 20px;
    }
`;

const InfoContent = styled(Box)`
    flex: 1;
`;

const InfoLabel = styled(Typography)`
    font-size: 12px;
    color: #999;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
`;

const InfoValue = styled(Typography)`
    font-size: 15px;
    color: #2c2c2c;
    font-weight: 500;
`;

const StatusChip = styled(Chip)`
    margin-top: 12px;
`;

const CloseButton = styled(Button)`
    width: 100%;
    margin-top: 20px;
    padding: 12px;
    border-radius: 12px;
    background: linear-gradient(135deg, #1b8e5c 0%, #15704c 100%);
    color: white;
    text-transform: none;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:hover {
        background: linear-gradient(135deg, #15704c 0%, #0f5838 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(27, 142, 92, 0.3);
    }
`;

const ProfileModal = ({ open, handleClose, person }) => {
    const { activeUsers } = useContext(AccountContext);
    const url = getProfilePictureUrl(person, defaultProfilePicture);
    const isOnline = activeUsers?.some(user => user.sub === person.sub);
    
    // Format date joined
    const formatDateJoined = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)'
                }
            }}
        >
            <ProfileCard>
                <HeaderSection>
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                        <Button 
                            onClick={handleClose}
                            sx={{
                                minWidth: 'auto',
                                padding: '8px',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                }
                            }}
                        >
                            <Close />
                        </Button>
                    </Box>
                    
                    <ProfileImage
                        src={url}
                        alt={person.name}
                        imgProps={{ referrerPolicy: 'no-referrer' }}
                    >
                        {url === defaultProfilePicture && getInitials(person.name)}
                    </ProfileImage>
                    
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 700, 
                            marginBottom: '8px',
                            fontSize: '20px'
                        }}
                    >
                        {person.name}
                    </Typography>
                    
                    <StatusChip
                        label={isOnline ? 'Online' : 'Offline'}
                        color={isOnline ? 'success' : 'default'}
                        size="small"
                        sx={{
                            backgroundColor: isOnline ? '#4caf50' : '#bdbdbd',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '12px'
                        }}
                    />
                </HeaderSection>

                <ContentSection>
                    <InfoItem>
                        <InfoIcon>
                            <PersonAddAlt />
                        </InfoIcon>
                        <InfoContent>
                            <InfoLabel>Member Since</InfoLabel>
                            <InfoValue>
                                {formatDateJoined(person.joinedAt || person.createdAt)}
                            </InfoValue>
                        </InfoContent>
                    </InfoItem>

                    {person.email && (
                        <>
                            <Divider sx={{ my: 2, opacity: 0.3 }} />
                            <InfoItem>
                                <InfoIcon>
                                    <Typography sx={{ fontSize: '18px' }}>✉️</Typography>
                                </InfoIcon>
                                <InfoContent>
                                    <InfoLabel>Email</InfoLabel>
                                    <InfoValue sx={{ wordBreak: 'break-all' }}>
                                        {person.email}
                                    </InfoValue>
                                </InfoContent>
                            </InfoItem>
                        </>
                    )}

                    {person.about && (
                        <>
                            <Divider sx={{ my: 2, opacity: 0.3 }} />
                            <InfoItem>
                                <InfoIcon>
                                    <Typography sx={{ fontSize: '18px' }}>💬</Typography>
                                </InfoIcon>
                                <InfoContent>
                                    <InfoLabel>About</InfoLabel>
                                    <InfoValue sx={{ fontStyle: 'italic' }}>
                                        {person.about}
                                    </InfoValue>
                                </InfoContent>
                            </InfoItem>
                        </>
                    )}

                    <Divider sx={{ my: 2, opacity: 0.3 }} />
                    
                    <InfoItem>
                        <InfoIcon>
                            <Schedule />
                        </InfoIcon>
                        <InfoContent>
                            <InfoLabel>Status</InfoLabel>
                            <InfoValue>
                                {isOnline ? (
                                    <Typography sx={{ color: '#4caf50', fontWeight: 600 }}>
                                        Active now
                                    </Typography>
                                ) : (
                                    <Typography sx={{ color: '#bdbdbd' }}>
                                        Offline
                                    </Typography>
                                )}
                            </InfoValue>
                        </InfoContent>
                    </InfoItem>

                    <CloseButton 
                        startIcon={<Close />}
                        onClick={handleClose}
                    >
                        Close Profile
                    </CloseButton>
                </ContentSection>
            </ProfileCard>
        </Dialog>
    );
};

export default ProfileModal;
