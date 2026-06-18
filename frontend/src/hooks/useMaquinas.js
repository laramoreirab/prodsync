import { useState, useEffect, useCallback } from 'react';
import { maquinaCrudService } from '@/services/maquinaCrudService';

const normalizarStatusMaquina = (status) => (status === 'Setup' ? 'Parada' : status);

export function useMaquinas() {
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // carregar dados
  const fetchMaquinas = useCallback(async () => {
    setLoading(true);

    try {
      const data = await maquinaCrudService.getAll();

      const maquinasNormalizadas = (data.dados || []).map((maquina) => ({
        ...maquina,
        id_exibicao_empresa: maquina.id_exibicao_empresa ?? maquina.id_maquina,
        status: normalizarStatusMaquina(maquina.status_atual || maquina.status || ''),
        status_atual: normalizarStatusMaquina(maquina.status_atual),
      }));
      setMaquinas(maquinasNormalizadas);
      setError(null);

    } catch (err) {
      console.error(err);
      setError('Falha ao carregar máquinas');

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaquinas();
  }, [fetchMaquinas]);

  // criar
  const cadastrarMaquina = async (dados) => {
    try {
      await maquinaCrudService.create(dados);

      // refetch completo
      await fetchMaquinas();

    } catch (err) {
      throw err;
    }
  };

  // editar
  const editarMaquina = async (id, dados) => {
    try {
      await maquinaCrudService.update(id, dados);

      // refetch completo
      await fetchMaquinas();

    } catch (err) {
      throw err;
    }
  };

  // deletar
  const excluirMaquina = async (id) => {
    try {
      await maquinaCrudService.delete(id);

      // delete pode continuar otimista
      setMaquinas(prev =>
        prev.filter(m => String(m.id_maquina) !== String(id))
      );

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


