import { useState, useEffect, useCallback } from 'react';
import { setorCrudService } from '@/services/setorCrudService';

export function useSetores() {
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizarSetor = (setor) => ({
    ...setor,
    id: setor.id ?? setor.id_setor,
    gestor: setor.gestor ?? setor.gestores?.[0]?.gestor?.nome ?? "-",
    oee_medio: setor.oee_medio ?? setor.oeeMedio ?? "-",
    qtd_de_maquinas: setor.qtd_de_maquinas ?? setor.maquinas?.length ?? 0,
    qtd_de_operadores: setor.qtd_de_operadores ?? setor.operadores?.length ?? 0,
  });

  //carregar todos os setores
  const fetchSetores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await setorCrudService.getAll();
      setSetores((data.dados || []).map(normalizarSetor));
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
      setSetores(prev => prev.map(s => String(s.id) === String(id) ? atualizado : s));
      return atualizado;
    } catch (err) {
      throw err;
    }
  };

  //deletar
  const excluirSetor = async (id) => {
    try {
      await setorCrudService.delete(id);
      setSetores(prev => prev.filter(s => String(s.id) !== String(id)));
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
