import { useState, useEffect, useCallback } from 'react';
import { maquinaCrudService } from '@/services/maquinaCrudService';

export function useMaquinas() {
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //carregar dados
  const fetchMaquinas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await maquinaCrudService.getAll();
      setMaquinas(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar máquinas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaquinas();
  }, [fetchMaquinas]);

  //criar
  const cadastrarMaquina = async (dados) => {
    try {
      const nova = await maquinaCrudService.create(dados);
      setMaquinas(prev => [...prev, nova]);
      return nova;
    } catch (err) {
      throw err;
    }
  };

  //editar
  const editarMaquina = async (id, dados) => {
    try {
      const atualizada = await maquinaCrudService.update(id, dados);
      setMaquinas(prev => prev.map(m => m.id === id ? atualizada : m));
      return atualizada;
    } catch (err) {
      throw err;
    }
  };

  //deletar
  const excluirMaquina = async (id) => {
    try {
      await maquinaCrudService.delete(id);
      setMaquinas(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    maquinas,
    loading,
    error,
    refresh: fetchMaquinas,
    cadastrarMaquina,
    editarMaquina,
    excluirMaquina
  };
}