import { apiFetch } from '@/lib/api';

const turnoCrudService = {
    create: async (payload) => {
        return await apiFetch('/api/turnos/criarTurno', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    getBySetor: async (id_setor) => {
        return await apiFetch(`/api/turnos/listarTurnos?id_setor=${id_setor}`);
    },

    delete: async (id_turno) => {
        return await apiFetch(`/api/turnos/${id_turno}`, { method: 'DELETE' });
    }
};

export default turnoCrudService;
