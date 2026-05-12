import { useState, useEffect, useCallback } from 'react';
import { setorCrudService } from '@/services/setorCrudService';

export function useSetores() {
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //carregar todos os setores
  const fetchSetores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await setorCrudService.getAll();
      setSetores(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar setores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSetores();
  }, [fetchSetores]);

  //criar
  const criarSetor = async (dados) => {
    try {
      const novo = await setorCrudService.create(dados);
      setSetores(prev => [...prev, novo]);
      return novo;
    } catch (err) {
      throw err;
    }
  };

  //editar
  const editarSetor = async (id, dados) => {
    try {
      const atualizado = await setorCrudService.update(id, dados);
      setSetores(prev => prev.map(s => s.id === id ? atualizado : s));
      return atualizado;
    } catch (err) {
      throw err;
    }
  };

  //deletar
  const excluirSetor = async (id) => {
    try {
      await setorCrudService.delete(id);
      setSetores(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    setores,
    loading,
    error,
    refresh: fetchSetores,
    criarSetor,
    editarSetor,
    excluirSetor,
  };
}