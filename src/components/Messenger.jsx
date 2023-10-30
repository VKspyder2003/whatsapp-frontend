import { AppBar, Toolbar, styled, Box } from '@mui/material'

import { useContext } from 'react'
import { AccountContext } from '../context/AccountProvider'

// Loading components
import LoginDialog from './account/LoginDialog'
import ChatDialog from './chat/ChatDialog'

// Custom CSS
const Container = styled(Box)`
  height: 100vh;
  background-color: #d1d7db;
`
const Header = styled(AppBar)`
  height: 125px;
  background-color: #00A884;
  box-shadow: none;
`

const LoginHeader = styled(AppBar)`
  height: 220px;
  background-color: #00bfa5;
  box-shadow: none;
`

const Messenger = () => {
    const { account } = useContext(AccountContext)

    return (
        <Container>
            {account ? (
                <>
                    <Header>
                        <Toolbar></Toolbar>
                    </Header>
                    <ChatDialog />
                </>
            ) : (
                <>
                    <LoginHeader>
                        <Toolbar></Toolbar>
                    </LoginHeader>
                    <LoginDialog />
                </>
            )}
        </Container>
    )
}

export default Messenger
