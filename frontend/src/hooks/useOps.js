import { useState, useEffect, useCallback } from 'react';
import { opCrudService } from '@/services/opCrudService';

export function useOps() {
  const [ops, setOps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //carregar todas as OPs
  const fetchOps = useCallback(async () => {
    setLoading(true);
    try {
      const data = await opCrudService.getAll();
      setOps(data?.dados || []);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar ordens de produção');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOps();
  }, [fetchOps]);

  //criar
  const criarOp = async (dados) => {
    try {
      const nova = await opCrudService.create(dados);
      setOps(prev => [...prev, nova]);
      return nova;
    } catch (err) {
      throw err;
    }
  };

  //editar
  const editarOp = async (id, dados) => {
    try {
      const atualizada = await opCrudService.update(id, dados);
      setOps(prev => prev.map(o => String(o.id) === String(id) ? atualizada : o));
      return atualizada;
    } catch (err) {
      throw err;
    }
  };

  //deletar
  const excluirOp = async (id, id_maquina) => {
    try {
      await opCrudService.delete(id, id_maquina);
      setOps(prev => prev.filter(o => String(o.id) !== String(id)));
    } catch (err) {
      throw err;
    }
  };

  return {
    ops,
    loading,
    error,
    refresh: fetchOps,
    criarOp,
    editarOp,
    excluirOp,
  };
}
