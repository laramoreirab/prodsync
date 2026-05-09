import api from './api';

const USE_MOCK = false;

const turnoCrudService = {
    create: async (payload) => {
        if (USE_MOCK) {
            console.log('Mock: Criando turno', payload);
            return { sucesso: true, dados: payload };
        }
        const response = await api.post('/api/turnos', payload);
        return response.data;
    },

    getBySetor: async (id_setor) => {
        if (USE_MOCK) {
            return { sucesso: true, dados: [] };
        }
        const response = await api.get(`/api/turnos?id_setor=${id_setor}`);
        return response.data;
    },

    delete: async (id_turno) => {
        if (USE_MOCK) return { sucesso: true };
        const response = await api.delete(`/api/turnos/${id_turno}`);
        return response.data;
    }
};

export default turnoCrudService;