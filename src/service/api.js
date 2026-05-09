import axios from 'axios'

const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'

const getApiError = (error, fallbackMessage) => {
    const apiError = new Error(fallbackMessage)

    if (error.response) {
        apiError.message = error.response.data?.message || fallbackMessage
        apiError.status = error.response.status
        apiError.detail = error.response.statusText || 'The server returned an error response.'
        return apiError
    }

    if (error.request) {
        apiError.message = 'Unable to reach the server.'
        apiError.detail = 'Please check your internet connection or try again in a moment.'
        return apiError
    }

    apiError.detail = error.message
    return apiError
}

export const addUser = async (data) => {
    try {
        let response = await axios.post(`${url}/add`, data);
        return response.data;
    } catch (error) {
        throw getApiError(error, 'Failed to add user.')
    }
}

export const getUsers = async () => {
    try {
        let response = await axios.get(`${url}/users`);
        return response.data
    } catch (error) {
        throw getApiError(error, 'Failed to load users.')
    }
}

export const updateUserStatus = async (data) => {
    try {
        let response = await axios.patch(`${url}/user/status`, data);
        return response.data;
    } catch (error) {
        throw getApiError(error, 'Failed to update status message.')
    }
}

export const setConversation = async (data) => {
    try {
        let response = await axios.post(`${url}/conversation/add`, data);
        return response.data;
    } catch (error) {
        console.log('Error while calling setConversation API ', error);
    }
}

export const getConversation = async (data) => {
    try {
        let response = await axios.post(`${url}/conversation/get`, data);
        return response.data;
    } catch (error) {
        console.log('Error while calling getConversation API ', error);
    }
}

export const getUserConversations = async (userId) => {
    try {
        let response = await axios.get(`${url}/conversations/${userId}`);
        return response.data;
    } catch (error) {
        throw getApiError(error, 'Failed to load conversations.')
    }
}

export const newMessage = async (data) => {
    try {
        return await axios.post(`${url}/message/add`, data);
    } catch (error) {
        console.log('Error while calling newConversations API ', error);
    }
}

export const getMessages = async (id) => {
    try {
        let response = await axios.get(`${url}/message/get/${id}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getMessage API ', error);
    }
}

export const markMessagesRead = async (data) => {
    try {
        return await axios.patch(`${url}/message/read`, data);
    } catch (error) {
        console.log('Error while calling markMessagesRead API ', error);
    }
}

export const uploadFile = async (data) => {
    try {
        return await axios.post(`${url}/file/upload`, data);
    } catch (error) {
        console.log('Error while uploadFile API ', error);
    }
}

export const clearConversation = async(conversationId, data) => {
    try {
        return await axios.post(`${url}/conversation/clear/${conversationId}`, data);
    } catch (error) {
        console.log('Error while clearConversation API ', error);
    }
}
