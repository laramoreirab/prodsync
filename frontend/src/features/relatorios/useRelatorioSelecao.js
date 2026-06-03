"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  criarSelecaoPadrao,
  obterTodosIdsSecao,
  PERIODO_EVENTOS_STORAGE,
  RELATORIO_VARIANTS,
} from "./relatorioSections";

export function useRelatorioSelecao(variant) {
  const config = RELATORIO_VARIANTS[variant];
  const ids = useMemo(() => obterTodosIdsSecao(variant), [variant]);
  const padrao = useMemo(() => criarSelecaoPadrao(variant), [variant]);

  const [selecao, setSelecao] = useState(padrao);
  const [periodoEventos, setPeriodoEventos] = useState(7);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    if (!config?.storageKey || typeof window === "undefined") return;
    try {
      const salvo = window.localStorage.getItem(config.storageKey);
      const periodoKey = PERIODO_EVENTOS_STORAGE[variant];
      const periodoSalvo = periodoKey
        ? window.localStorage.getItem(periodoKey)
        : null;

      if (periodoSalvo && [7, 15, 30].includes(Number(periodoSalvo))) {
        setPeriodoEventos(Number(periodoSalvo));
      }

      if (salvo) {
        const parsed = JSON.parse(salvo);
        const mesclado = { ...padrao };
        ids.forEach((id) => {
          if (typeof parsed[id] === "boolean") mesclado[id] = parsed[id];
        });
        setSelecao(mesclado);
      }
    } catch {
      setSelecao(padrao);
    } finally {
      setCarregado(true);
    }
  }, [config?.storageKey, padrao, ids, variant]);

  useEffect(() => {
    if (!carregado || !config?.storageKey || typeof window === "undefined") return;
    window.localStorage.setItem(config.storageKey, JSON.stringify(selecao));
    const periodoKey = PERIODO_EVENTOS_STORAGE[variant];
    if (periodoKey) {
      window.localStorage.setItem(periodoKey, String(periodoEventos));
    }
  }, [selecao, periodoEventos, carregado, config?.storageKey, variant]);

  const toggle = useCallback((id) => {
    setSelecao((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleArea = useCallback(
    (areaId) => {
      const area = config?.areas.find((a) => a.id === areaId);
      if (!area) return;
      const idsArea = area.secoes.map((s) => s.id);
      const todosAtivos = idsArea.every((id) => selecao[id]);
      setSelecao((prev) => {
        const next = { ...prev };
        idsArea.forEach((id) => {
          next[id] = !todosAtivos;
        });
        return next;
      });
    },
    [config?.areas, selecao],
  );

  const selecionarTodos = useCallback(() => {
    setSelecao(padrao);
  }, [padrao]);

  const limparTodos = useCallback(() => {
    setSelecao(Object.fromEntries(ids.map((id) => [id, false])));
  }, [ids]);

  const ativos = useMemo(
    () => ids.filter((id) => selecao[id]).length,
    [ids, selecao],
  );

  const estaAtivo = useCallback((id) => Boolean(selecao[id]), [selecao]);

  return {
    selecao,
    periodoEventos,
    setPeriodoEventos,
    toggle,
    toggleArea,
    selecionarTodos,
    limparTodos,
    ativos,
    total: ids.length,
    estaAtivo,
    carregado,
  };
}
