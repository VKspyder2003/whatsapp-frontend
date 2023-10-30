import React from "react";
import { useContext, useEffect, useState } from "react";

import { Box, styled, Divider } from '@mui/material'

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import { getUsers } from "../../../service/api";
import { AccountContext } from '../../../context/AccountProvider'

import Conversation from "./Conversation";
import Loader from "../../Loader/Loader";

const Component = styled(Box)`
    overflow: overlay;
    height: 81vh;
`;

const StyledDivider = styled(Divider)`
    margin: 0 0 0 70px;
    background-color: #e9edef;
    opacity: .6;
`;

const Conversations = ({ text }) => {
    const [users, setUsers] = useState([]);
    const [fetchResult, setFetchResult] = useState(true);
    const [loading, setLoading] = useState(true);

    const { account, socket, setActiveUsers } = useContext(AccountContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let data = await getUsers();
                let filteredData = data.filter(user => user.name.toLowerCase().includes(text.toLowerCase()));
                setUsers(filteredData);
                setLoading(false);
            } catch (error) {
                console.log(error.message);
                setFetchResult(false);
                setLoading(false);
            }
        };
        fetchData();
    }, [text]);

    useEffect(() => {
        const getEffect = () => {
            socket.current.emit('addUser', account);
            socket.current.on('getUsers', users => {
                setActiveUsers(users);
            });
        };
        getEffect();
    }, [account]);

    return (
        <Component>
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Loader />
                    <p>Loading users...</p>
                </div>
            ) : fetchResult ? (
                users.map((user) => {
                    if (user.sub !== account.sub)
                        return (
                            <React.Fragment key={user.sub}>
                                <Conversation user={user} />
                                <StyledDivider />
                            </React.Fragment>
                        );
                    else
                        return null;
                })
            ) : (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    <strong>Failed to fetch Users</strong>
                </Alert>
            )}
        </Component>
    );
};

export default Conversations;