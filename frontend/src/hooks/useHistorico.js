import { useState, useEffect, useCallback } from 'react';
import { maquinaCrudService } from '@/services/maquinaCrudService';

export function useEventos() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //carregar dados
    const fetchEventos = useCallback(async () => {
        setLoading(true);
        try {
            const data = await maquinaCrudService.getAll();
            setEventos(data);
            setError(null);
        } catch (err) {
            setError('Falha ao carregar eventos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]);

    //criar
    const cadastrarMaquina = async (dados) => {
        try {
            const nova = await maquinaCrudService.create(dados);
            setEventos(prev => [...prev, nova]);
            return nova;
        } catch (err) {
            throw err;
        }
    };

    //editar
    const editarEvento = async (id, dados) => {
        try {
            const atualizada = await eventoCrudService.update(id, dados);
            setEventos(prev => prev.map(m => m.id === id ? atualizada : m));
            return atualizada;
        } catch (err) {
            throw err;
        }
    };

    //deletar
    const excluirEvento = async (id) => {
        try {
            await eventoCrudService.delete(id);
            setEventos(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            throw err;
        }
    };

    return {
        eventos,
        loading,
        error,
        refresh: fetchEventos,
        cadastrarMaquina,
        editarMaquina,
        excluirMaquina
    };
}