import { apiFetch } from '@/lib/api';

const USE_MOCK = false;

const turnoCrudService = {
    create: async (payload) => {
        if (USE_MOCK) {
            console.log('Mock: Criando turno', payload);
            return { sucesso: true, dados: payload };
        }
        return await apiFetch('/api/turnos/criarTurno', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    getBySetor: async (id_setor) => {
        if (USE_MOCK) {
            return { sucesso: true, dados: [] };
        }
        return await apiFetch(`/api/turnos/listarTurnos?id_setor=${id_setor}`);
    },

    delete: async (id_turno) => {
        if (USE_MOCK) return { sucesso: true };
        return await apiFetch(`/api/turnos/${id_turno}`, { method: 'DELETE' });
    }
};

export default turnoCrudService;
