import { createContext, useState, useRef, useEffect } from 'react'

import { io } from 'socket.io-client'

export const AccountContext = createContext(null)

const ACCOUNT_STORAGE_KEY = 'whatsapp-clone-account'

const getStoredAccount = () => {
    try {
        const storedAccount = localStorage.getItem(ACCOUNT_STORAGE_KEY)
        return storedAccount ? JSON.parse(storedAccount) : null
    } catch (error) {
        try {
            localStorage.removeItem(ACCOUNT_STORAGE_KEY)
        } catch (storageError) {
            console.error('Unable to clear invalid stored account:', storageError)
        }
        return null
    }
}

const persistAccount = (accountData) => {
    try {
        if (accountData) {
            localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accountData))
        } else {
            localStorage.removeItem(ACCOUNT_STORAGE_KEY)
        }
    } catch (error) {
        console.error('Unable to update stored account:', error)
    }
}

const AccountProvider = ({ children }) => {

    const [account, setAccountState] = useState(getStoredAccount);
    const [person, setPerson] = useState({});
    const [activeUsers, setActiveUsers] = useState([])
    const [newMessageFlag, setNewMessageFlag] = useState(false)
    const [updateMessage, setUpdateMessage] = useState(false)

    const socket = useRef();
    const accountRef = useRef(account);

    useEffect(() => {
        accountRef.current = account;
    }, [account]);

    useEffect(() => {
        const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000'
        const socketInstance = io(socketUrl, {
            autoConnect: false,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });
        socket.current = socketInstance;

        const handleConnect = () => {
            const currentAccount = accountRef.current;
            console.log('Socket connected with ID:', socketInstance.id);

            if (currentAccount) {
                socketInstance.emit('addUser', currentAccount);
            }
        };

        const handleDisconnect = () => {
            console.log('Socket disconnected');
        };

        const handleConnectError = (error) => {
            console.error('Socket connection error:', error);
        };

        const handleActiveUsers = (users) => {
            setActiveUsers(Array.isArray(users) ? users : []);
        };

        const handleSocketError = (error) => {
            console.error('Socket error:', error);
        };

        socketInstance.on('connect', handleConnect);
        socketInstance.on('disconnect', handleDisconnect);
        socketInstance.on('connect_error', handleConnectError);
        socketInstance.on('getUsers', handleActiveUsers);
        socketInstance.on('error', handleSocketError);

        if (accountRef.current) {
            socketInstance.connect();
        }

        return () => {
            socketInstance.off('connect', handleConnect);
            socketInstance.off('disconnect', handleDisconnect);
            socketInstance.off('connect_error', handleConnectError);
            socketInstance.off('getUsers', handleActiveUsers);
            socketInstance.off('error', handleSocketError);
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        const socketInstance = socket.current;

        if (!socketInstance) return;

        if (account) {
            if (socketInstance.connected) {
                socketInstance.emit('addUser', account);
            } else {
                socketInstance.connect();
            }
            return;
        }

        setActiveUsers([]);
        socketInstance.disconnect();
    }, [account]);

    const setAccount = (accountData) => {
        setAccountState(accountData)
        persistAccount(accountData)

        if (!accountData) {
            setPerson({})
            setActiveUsers([])
        }
    }

    return (
        <AccountContext.Provider value={{
            account, 
            setAccount,
            person,
            setPerson,
            socket,
            activeUsers,
            setActiveUsers,
            newMessageFlag,
            setNewMessageFlag,
            updateMessage, 
            setUpdateMessage
        }}>
            {children}
        </AccountContext.Provider>
    )

}

export default AccountProvider;
