import api from './api';

const resumeService = {
    getAll: async () => {
        const response = await api.get('/resumes');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/resumes/${id}`);
        return response.data;
    },

    upload: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/resumes/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    setPrimary: async (id) => {
        const response = await api.put(`/resumes/${id}/primary`);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/resumes/${id}`);
        return response.data;
    },

    download: async (id) => {
        const response = await api.get(`/resumes/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },
};

export default resumeService;
