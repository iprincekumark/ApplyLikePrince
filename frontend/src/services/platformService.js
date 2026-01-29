import api from './api';

const platformService = {
    getAll: async () => {
        const response = await api.get('/platforms');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/platforms/${id}`);
        return response.data;
    },

    getActive: async () => {
        const response = await api.get('/platforms/active');
        return response.data;
    },
};

export default platformService;
