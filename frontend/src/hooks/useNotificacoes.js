"use client";

import { useCallback, useEffect, useState } from "react";
import { notificacaoService } from "@/services/notificacaoService";

const INTERVALO_MS = 30000;

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [contagem, setContagem] = useState(0);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    try {
      const [lista, total] = await Promise.all([
        notificacaoService.listar({ limite: 15 }),
        notificacaoService.contarNaoLidas(),
      ]);
      setNotificacoes(lista);
      setContagem(total);
    } catch {
      setNotificacoes([]);
      setContagem(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
    const intervalo = setInterval(carregar, INTERVALO_MS);
    return () => clearInterval(intervalo);
  }, [carregar]);

  const marcarComoLida = useCallback(async (id) => {
    await notificacaoService.marcarComoLida(id);
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
    setContagem((prev) => Math.max(0, prev - 1));
  }, []);

  const marcarTodasComoLidas = useCallback(async () => {
    await notificacaoService.marcarTodasComoLidas();
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
    setContagem(0);
  }, []);

  const excluir = useCallback(async (id) => {
    await notificacaoService.excluir(id);
    setNotificacoes((prev) => {
      const removida = prev.find((n) => n.id === id);
      if (removida && !removida.lida) {
        setContagem((total) => Math.max(0, total - 1));
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  return {
    notificacoes,
    contagem,
    loading,
    refresh: carregar,
    marcarComoLida,
    marcarTodasComoLidas,
    excluir,
  };
}
