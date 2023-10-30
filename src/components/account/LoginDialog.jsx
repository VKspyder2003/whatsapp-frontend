import {
    Dialog,
    Box,
    Typography,
    List,
    ListItem,
    styled,
    BackdropProps
} from '@mui/material'

import { useContext, useState } from 'react'

import { qrCodeImage } from '../../constants/data'
import { AccountContext } from '../../context/AccountProvider'
import { addUser } from '../../service/api'


import { GoogleLogin } from '@react-oauth/google'
import jwt_decode from 'jwt-decode'
import TitleManager from '../../title/TitleManager'
import Loader from '../Loader/Loader'

const dialogStyle = {
    marginTop: '12%',
    height: '95%',
    width: '60%',
    maxWidth: '100',
    maxHeight: '100%',
    borderRadius: 0,
    boxShadow: 'none',
    overflow: 'hidden'
}

const Container = styled(Box)`
  display: flex;
`

const Component = styled(Box)`
  padding: 56px 0 56px 56px;
`

const Title = styled(Typography)`
  font-size: 26px;
  margin-bottom: 25px;
  color: #525252;
  font-family: Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu,
    Cantarell, Fira Sans, sans-serif;
  font-weight: 300;
`

const StyledList = styled(List)`
  & > li {
    padding: 0;
    margin-top: 15px;
    font-size: 18px;
    line-height: 28px;
    color: #4a4a4a;
  }
`

const QRCode = styled('img')({
    height: 264,
    width: 264,
    margin: '50px 0 0 50px'
})

const LoginDialog = () => {
    const { setAccount } = useContext(AccountContext);
    const [loading, setLoading] = useState(false);

    const onLoginSuccess = async (res) => {
        const decoded = jwt_decode(res.credential);
        setAccount(decoded);
        await addUser(decoded);
    };

    const onLoginError = () => {
        // Handle login error
    };

    const pageTitle = 'Whatsapp Login';

    return (
        <Dialog
            open={true}
            BackdropProps={{ style: { backgroundColor: 'unset' } }}
            maxWidth={'md'}
            PaperProps={{ sx: dialogStyle }}
        >
            <TitleManager title={pageTitle} />
            <Container>
                <Component>
                    <Title>Use WhatsApp on your computer</Title>
                    <StyledList>
                        <ListItem>
                            <span>1. Sign In using your Google account</span>
                        </ListItem>
                        <ListItem>
                            <span>2. Explore a new way of communication</span>
                        </ListItem>
                        <ListItem>
                            <span>3. Connect with multiple users and chat real time</span>
                        </ListItem>
                    </StyledList>
                </Component>
                <Box position={'relative'}>
                    <QRCode src={qrCodeImage} alt="qr code" />
                    {loading ? ( 
                        <Loader />
                    ) : (
                        <Box
                            style={{
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateX(30%) translateY(-25%)',
                            }}
                        >
                            <GoogleLogin
                                onSuccess={onLoginSuccess}
                                onError={onLoginError}
                                onLoading={() => setLoading(true)}
                                onLoaded={() => setLoading(false)}
                            />
                        </Box>
                    )}
                </Box>
            </Container>
        </Dialog>
    );
};


export default LoginDialog
