import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

const anecdoteService = {
    getAll: async () => {
        const response = await axios.get(baseUrl);
        return response.data;
    },

    create: async (content) => {
        const anecdote = { content, votes: 0 };
        const response = await axios.post(baseUrl, anecdote);
        return response.data;
    },

    update: async (anecdote) => {
        const response = await axios.put(`${baseUrl}/${anecdote.id}`, anecdote);
        return response.data;
    },
};

export default anecdoteService;