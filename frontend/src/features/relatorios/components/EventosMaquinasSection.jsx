"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { RelatorioSection } from "./RelatorioSection";
import { PERIODOS_EVENTOS_RELATORIO } from "../utils/formatters";

function formatarDataHora(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function EventosMaquinasSection({ ativo, periodoDias, setorId = null }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const periodoLabel =
    PERIODOS_EVENTOS_RELATORIO.find((p) => p.value === periodoDias)?.label ??
    `Últimos ${periodoDias} dias`;

  useEffect(() => {
    if (!ativo) return;
    let cancelado = false;
    setLoading(true);

    async function carregar() {
      try {
        const params = new URLSearchParams({ dias: String(periodoDias) });
        if (setorId) params.set("setorId", String(setorId));
        const res = await apiFetch(`/api/eventos/relatorio?${params}`);
        if (!cancelado) setEventos(res?.dados ?? []);
      } catch {
        if (!cancelado) setEventos([]);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [ativo, periodoDias, setorId]);

  if (!ativo) return null;

  return (
    <RelatorioSection
      id="eventos-maquinas"
      ativo
      titulo={`Eventos das máquinas — ${periodoLabel}`}
    >
      {loading ? (
        <p className="text-sm text-muted-foreground">Sincronizando eventos...</p>
      ) : eventos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum evento no período selecionado.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="relatorio-tabela w-full text-left text-sm">
            <thead>
              <tr className="bg-[#23304c] text-white">
                <th className="px-3 py-2.5 font-semibold">ID</th>
                <th className="px-3 py-2.5 font-semibold">Máquina</th>
                <th className="px-3 py-2.5 font-semibold">Tipo</th>
                <th className="px-3 py-2.5 font-semibold">Início</th>
                <th className="px-3 py-2.5 font-semibold">Fim</th>
                <th className="px-3 py-2.5 font-semibold">Duração</th>
                <th className="px-3 py-2.5 font-semibold">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento, i) => (
                <tr
                  key={evento.id ?? evento.id_evento ?? i}
                  className={i % 2 === 0 ? "bg-white" : "bg-[#f8faff]"}
                >
                  <td className="px-3 py-2 text-center font-medium text-[#23304c]">
                    {evento.id ?? evento.id_evento}
                  </td>
                  <td className="px-3 py-2 font-medium text-[#23304c]">{evento.maquina}</td>
                  <td className="px-3 py-2">{evento.tipo}</td>
                  <td className="px-3 py-2 text-muted-foreground">{formatarDataHora(evento.inicio)}</td>
                  <td className="px-3 py-2 text-muted-foreground">{formatarDataHora(evento.fim)}</td>
                  <td className="px-3 py-2">{evento.duracao}</td>
                  <td className="px-3 py-2 max-w-[180px] truncate" title={evento.motivo}>
                    {evento.motivo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </RelatorioSection>
  );
}
