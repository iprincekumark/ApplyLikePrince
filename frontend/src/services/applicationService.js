import api from './api';

const applicationService = {
    getAll: async (params = {}) => {
        const response = await api.get('/applications', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/applications/${id}`);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/applications/stats');
        return response.data;
    },

    apply: async (applicationData) => {
        const response = await api.post('/applications/apply', applicationData);
        return response.data;
    },

    bulkApply: async (platforms, resumeId) => {
        const response = await api.post('/applications/bulk-apply', {
            platformIds: platforms,
            resumeId,
        });
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/applications/${id}/status`, { status });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/applications/${id}`);
        return response.data;
    },
};

export default applicationService;
