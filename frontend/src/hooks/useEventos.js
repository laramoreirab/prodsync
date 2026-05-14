import { useState, useEffect, useCallback } from 'react';
import { eventosCrudService } from '@/services/eventosCrudService';

export function useEventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //carregar todos os eventos
  const fetchEventos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await eventosCrudService.getAll();
      // Backend retorna { sucesso, dados, meta } — extrai o array
      const lista = Array.isArray(res) ? res : (res?.dados ?? []);
      setEventos(lista);
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

  //registrar novo evento
  const registrarEvento = async (dados) => {
    try {
      const novo = await eventosCrudService.create(dados);
      setEventos(prev => [...prev, novo]);
      return novo;
    } catch (err) {
      throw err;
    }
  };

  //justificar evento existente
  const justificarEvento = async (dados) => {
    try {
      const atualizado = await eventosCrudService.justificar(dados);
      setEventos(prev => prev.map(e => e.id === atualizado.id ? atualizado : e));
      return atualizado;
    } catch (err) {
      throw err;
    }
  };

  return {
    eventos,
    loading,
    error,
    refresh: fetchEventos,
    registrarEvento,
    justificarEvento,
  };
}