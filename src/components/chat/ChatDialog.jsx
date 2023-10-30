import { useContext, lazy, Suspense } from 'react';
import { Dialog, styled, Box } from '@mui/material';


//Components
import Menu from './menu/Menu';
import ChatBox from './chat/ChatBox';
import { AccountContext } from '../../context/AccountProvider';
import TitleManager from '../../title/TitleManager';
import Loader from '../Loader/Loader';

const EmptyChat = lazy(() => import('./chat/EmptyChat'))


const dialogStyle = {
    height: '95%',
    width: '100%',
    margin: '20px',
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 0,
    boxShadow: 'none',
    overflow: 'hidden'
};

const Component = styled(Box)`
    display: flex;
`;

const LeftComponent = styled(Box)`
    min-width: 450px;
`;

const RightComponent = styled(Box)`
    width: 73%;
    min-width: 300px;
    height: 100%;
    border-left: 1px solid rgba(0, 0, 0, 0.14);
`;


const ChatDialog = () => {

    const { account, person } = useContext(AccountContext);

    const pageTitle = 'Whatsapp | ' + account.name;

    return (
        <Dialog
            open={true}
            BackdropProps={{ style: { backgroundColor: 'unset' } }}
            PaperProps={{ sx: dialogStyle }}
            maxWidth={'md'}
        >
            <TitleManager title={pageTitle} />
            <Component>
                <LeftComponent>
                    <Menu />
                </LeftComponent>
                <RightComponent>
                    {
                        (Object?.keys(person)?.length) ? <ChatBox /> : <Suspense fallback={<Loader />}><EmptyChat /></Suspense>
                    }
                </RightComponent>
            </Component>
        </Dialog>
    )
}

export default ChatDialog;