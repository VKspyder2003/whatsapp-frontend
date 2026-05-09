import {
    Dialog,
    Box,
    Typography,
    List,
    ListItem,
    styled
} from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'

import { useContext, useState } from 'react'

import { qrCodeImage } from '../../constants/data'
import { AccountContext } from '../../context/AccountProvider'
import { addUser } from '../../service/api'

import { GoogleLogin } from '@react-oauth/google'
import jwt_decode from 'jwt-decode'
import TitleManager from '../../title/TitleManager'
import Loader from '../Loader/Loader'

const dialogStyle = {
    width: 'min(960px, calc(100vw - 32px))',
    maxWidth: '960px',
    maxHeight: 'calc(100vh - 32px)',
    margin: 0,
    borderRadius: { xs: 3, sm: 4 },
    boxShadow: '0 24px 70px rgba(17, 27, 33, 0.18)',
    overflow: 'hidden'
}

const Container = styled(Box)`
  display: flex;
  min-height: min(560px, calc(100vh - 32px));

  @media (max-width: 760px) {
    flex-direction: column;
    min-height: auto;
    max-height: calc(100vh - 32px);
    overflow-y: auto;
  }
`

const Component = styled(Box)`
  padding: 56px 40px 56px 56px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 760px) {
    padding: 32px 28px 24px;
  }

  @media (max-width: 420px) {
    padding: 28px 20px 20px;
  }
`

const Title = styled(Typography)`
  font-size: 32px;
  margin-bottom: 25px;
  color: #2f3337;
  font-weight: 600;
  line-height: 1.18;

  @media (max-width: 760px) {
    font-size: 26px;
    margin-bottom: 16px;
  }
`

const Description = styled(Typography)`
  font-size: 16px;
  line-height: 1.7;
  color: #5a5f66;
  margin-bottom: 30px;

  @media (max-width: 760px) {
    margin-bottom: 16px;
  }
`

const StyledList = styled(List)`
  & > li {
    padding: 0;
    margin-top: 18px;
    font-size: 17px;
    line-height: 28px;
    color: #4a4a4a;
  }

  @media (max-width: 760px) {
    & > li {
      margin-top: 10px;
      font-size: 15px;
      line-height: 24px;
    }
  }
`

const QRCodeContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 0.8;
    background: #fafafa;
    padding: 32px;

    @media (max-width: 760px) {
      padding: 24px 28px 32px;
    }

    @media (max-width: 420px) {
      padding: 20px 20px 28px;
    }
`

const QRCode = styled('img')({
    height: 'min(264px, 58vw)',
    width: 'min(264px, 58vw)',
    marginBottom: 30,
    borderRadius: 18,
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    objectFit: 'cover'
})

const HelpText = styled(Typography)`
  font-size: 14px;
  color: #6c757d;
  text-align: center;
  max-width: 280px;
  margin-bottom: 20px;
`

const ErrorText = styled(Box)`
  color: #d32f2f;
  margin-top: 16px;
  font-size: 14px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fff5f5;
  border: 1px solid #f4c7c7;
  max-width: 300px;
`

const LoginDialog = () => {
    const { setAccount } = useContext(AccountContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onLoginSuccess = async (res) => {
        try {
            setError('');
            const decoded = jwt_decode(res.credential);
            const accountData = await addUser(decoded);
            setAccount(accountData || decoded);
        } catch (err) {
            setError('Unable to sign in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onLoginError = () => {
        setLoading(false);
        setError('Login failed. Please refresh and try again.');
    };

    const pageTitle = 'WhatsApp Login';

    return (
        <Dialog
            open={true}
            BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.24)' } }}
            maxWidth={false}
            sx={{
                '& .MuiDialog-container': {
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }}
            PaperProps={{ sx: dialogStyle }}
            aria-labelledby="login-dialog-title"
        >
            <TitleManager title={pageTitle} />
            <Container>
                <Component>
                    <Title id="login-dialog-title">Use WhatsApp on your computer</Title>
                    <Description>
                        Sign in with a Google account to unlock fast messaging, group chats, and secure media sharing in real time.
                    </Description>
                    <StyledList>
                        <ListItem>
                            <span>1. Sign in using your Google account</span>
                        </ListItem>
                        <ListItem>
                            <span>2. Enjoy an improved desktop chat experience</span>
                        </ListItem>
                        <ListItem>
                            <span>3. Stay connected with friends, family, and colleagues</span>
                        </ListItem>
                    </StyledList>
                </Component>
                <QRCodeContainer>
                    <QRCode src={qrCodeImage} alt="qr code" />
                    <HelpText>
                        Scan the QR code or sign in with Google to continue. Your login is protected and your chats stay private.
                    </HelpText>
                    {loading ? (
                        <Loader compact message="Signing you in..." />
                    ) : (
                        <GoogleLogin
                            onSuccess={onLoginSuccess}
                            onError={onLoginError}
                            onLoading={() => {
                                setLoading(true);
                                setError('');
                            }}
                            onLoaded={() => setLoading(false)}
                        />
                    )}
                    {error && (
                        <ErrorText>
                            <ErrorOutline fontSize="small" />
                            <Typography variant="body2">{error}</Typography>
                        </ErrorText>
                    )}
                </QRCodeContainer>
            </Container>
        </Dialog>
    );
};

export default LoginDialog
