import React from "react";
import { useCallback, useContext, useEffect, useState } from "react";

import { Box, styled, Divider } from '@mui/material'

import { getUserConversations, getUsers } from "../../../service/api";
import { AccountContext } from '../../../context/AccountProvider'

import Conversation from "./Conversation";
import Loader from "../../Loader/Loader";
import ErrorState from "../../common/ErrorState";

const Component = styled(Box)`
    overflow: overlay;
    height: 81vh;
`;

const SectionTitle = styled(Box)`
    padding: 14px 20px 6px;
    color: #008069;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .4px;
    text-transform: uppercase;
`;

const StyledDivider = styled(Divider)`
    margin: 0 0 0 70px;
    background-color: #e9edef;
    opacity: .6;
`;

const NoResultsMessage = styled(Box)`
    text-align: center;
`;

const LoadingState = styled(Box)`
    height: 100%;
    min-height: 320px;
    display: flex;
`;

const Conversations = ({ text }) => {
    const [users, setUsers] = useState([]);
    const [chatSummaries, setChatSummaries] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const { account, socket, newMessageFlag, updateMessage, readConversationId } = useContext(AccountContext);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [usersData, conversationsData] = await Promise.all([
                getUsers(),
                getUserConversations(account.sub)
            ]);

            if (!Array.isArray(usersData) || !Array.isArray(conversationsData)) {
                const responseError = new Error('The users API returned an unexpected response.');
                responseError.detail = 'Expected contact and conversation lists from the backend.';
                throw responseError;
            }

            const normalizedSearch = text.trim().toLowerCase();
            const filterBySearch = (user) => user?.name?.toLowerCase().includes(normalizedSearch);

            setChatSummaries(conversationsData.filter((summary) => filterBySearch(summary.user)));
            setUsers(usersData.filter(filterBySearch));
        } catch (error) {
            setUsers([]);
            setChatSummaries([]);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [account.sub, text]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        const socketInstance = socket.current;
        if (!socketInstance || !account?.sub) return;

        const updateConversationLocally = (message) => {
            if (message?.receiverId === account.sub || message?.senderId === account.sub) {
                setChatSummaries((prev) =>
                    prev.map((summary) => {
                        const isRelevantConversation =
                            (summary.conversation?._id === message.conversationId) ||
                            ((message.senderId === summary.user?.sub || message.receiverId === summary.user?.sub) &&
                             (message.receiverId === account.sub || message.senderId === account.sub));

                        if (isRelevantConversation) {
                            return {
                                ...summary,
                                lastMessage: {
                                    text: message.text,
                                    createdAt: message.createdAt
                                },
                                updatedAt: message.createdAt,
                                unreadCount: message.senderId === account.sub ? 0 : (summary.unreadCount || 0)
                            };
                        }
                        return summary;
                    })
                );
            }
        };

        socketInstance.on('getMessage', updateConversationLocally);

        return () => {
            socketInstance.off('getMessage', updateConversationLocally);
        };
    }, [account?.sub, socket]);

    const historyUserIds = new Set(chatSummaries.map((summary) => summary.user?.sub));
    const startChatUsers = users
        .filter((user) => user.sub !== account.sub && !historyUserIds.has(user.sub))
        .sort((a, b) => a.name.localeCompare(b.name));
    const hasResults = chatSummaries.length > 0 || startChatUsers.length > 0;

    return (
        <Component>
            {loading ? (
                <LoadingState>
                    <Loader fill message="Loading your contacts..." />
                </LoadingState>
            ) : error ? (
                <ErrorState
                    title="Could not load contacts"
                    message={error.message || 'The contact list could not be loaded right now.'}
                    detail={error.detail || 'Please try again. If this keeps happening, the backend service may need attention.'}
                    status={error.status}
                    actionLabel="Retry loading contacts"
                    onRetry={loadUsers}
                />
            ) : (
                !hasResults ? (
                    <NoResultsMessage>No results found</NoResultsMessage>
                ) : (
                    <>
                        {chatSummaries.length > 0 && (
                            <>
                                <SectionTitle>Your chats</SectionTitle>
                                {chatSummaries.map((summary) => (
                                    <React.Fragment key={summary.conversation?._id || summary.user.sub}>
                                        <Conversation
                                            user={summary.user}
                                            lastMessage={summary.lastMessage}
                                            unreadCount={summary.unreadCount}
                                            conversationUpdatedAt={summary.updatedAt}
                                            conversationId={summary.conversation?._id}
                                        />
                                        <StyledDivider />
                                    </React.Fragment>
                                ))}
                            </>
                        )}

                        {startChatUsers.length > 0 && (
                            <>
                                <SectionTitle>Start new chat</SectionTitle>
                                {startChatUsers.map((user) => (
                                    <React.Fragment key={user.sub}>
                                        <Conversation user={user} />
                                        <StyledDivider />
                                    </React.Fragment>
                                ))}
                            </>
                        )}
                    </>
                )
            )}
        </Component>
    );
};

export default Conversations;
