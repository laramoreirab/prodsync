"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { RelatorioSection } from "./RelatorioSection";

export function SetoresResumoSection({ ativo }) {
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ativo) return;
    let cancelado = false;

    async function carregar() {
      try {
        const res = await apiFetch("/api/setores/empresa");
        if (!cancelado) setSetores(res?.dados ?? []);
      } catch {
        if (!cancelado) setSetores([]);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [ativo]);

  if (!ativo) return null;

  return (
    <RelatorioSection id="setores-resumo" ativo titulo="Panorama por setores">
      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando setores...</p>
      ) : setores.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum setor cadastrado.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="relatorio-tabela w-full text-left text-sm">
            <thead>
              <tr className="bg-[#23304c] text-white">
                <th className="px-4 py-2.5 font-semibold">Setor</th>
                <th className="px-4 py-2.5 font-semibold">Localização</th>
                <th className="px-4 py-2.5 font-semibold">Gestor(es)</th>
                <th className="px-4 py-2.5 text-center font-semibold">Máquinas</th>
                <th className="px-4 py-2.5 text-center font-semibold">Operadores</th>
                <th className="px-4 py-2.5 text-center font-semibold">OEE médio</th>
              </tr>
            </thead>
            <tbody>
              {setores.map((setor, i) => {
                const gestores = (setor.gestores ?? [])
                  .map((g) => g.gestor?.nome ?? g.nome)
                  .filter(Boolean)
                  .join(", ");

                return (
                  <tr
                    key={setor.id_setor ?? setor.id ?? i}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#f8faff]"}
                  >
                    <td className="px-4 py-2 font-medium text-[#23304c]">
                      {setor.nome_setor ?? setor.setor ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {setor.localizacao || "—"}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{gestores || "—"}</td>
                    <td className="px-4 py-2 text-center">
                      {setor.qtd_de_maquinas ?? setor.qtdMaquinas ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {setor.qtd_de_operadores ?? setor.qtdOperadores ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-center font-medium text-[#00357a]">
                      {setor.oee_medio ?? (setor.oeeMedio != null ? `${setor.oeeMedio}%` : "—")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </RelatorioSection>
  );
}
