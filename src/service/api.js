import axios from 'axios'

const url = 'https://whatsapp-backend-x71u.onrender.com'

export const addUser = async (data) => {
    try {
        let response = await axios.post(`${url}/add`, data);
        return response.data;
    } catch (error) {
        console.log('Error while calling addUser API ', error);
    }
}

export const getUsers = async () => {
    try {
        let response = await axios.get(`${url}/users`);
        return response.data
    } catch (error) {
        console.log('Error while calling getUsers API ', error);
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