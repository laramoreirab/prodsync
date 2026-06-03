"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCheck, Eraser } from "lucide-react";
import { PERIODOS_EVENTOS_RELATORIO } from "../utils/formatters";

export function RelatorioCustomizer({
  areas,
  selecao,
  periodoEventos,
  onPeriodoEventosChange,
  onToggle,
  onToggleArea,
  onSelecionarTodos,
  onLimparTodos,
  ativos,
  total,
}) {
  return (
    <aside
      data-print-hide
      className="relatorio-customizer shrink-0 rounded-2xl border border-gray-200/90 bg-white/95 p-5 shadow-sm backdrop-blur lg:sticky lg:top-4 lg:w-80"
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-[#23304c]">Personalizar PDF</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha as áreas e indicadores que entram no relatório.
        </p>
        <p className="mt-2 text-xs font-medium text-secondary-foreground">
          {ativos} de {total} seções ativas
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onSelecionarTodos}>
          <CheckCheck className="mr-1.5 size-4" />
          Marcar tudo
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onLimparTodos}>
          <Eraser className="mr-1.5 size-4" />
          Limpar
        </Button>
      </div>

      <div className="max-h-[calc(100vh-14rem)] space-y-5 overflow-y-auto pr-1 scrollbar-hide">
        {areas.map((area) => {
          const idsArea = area.secoes.map((s) => s.id);
          const marcados = idsArea.filter((id) => selecao[id]).length;

          return (
            <div key={area.id} className="rounded-xl border border-gray-100 bg-[#f8faff]/80 p-3">
              <button
                type="button"
                onClick={() => onToggleArea(area.id)}
                className="mb-2 w-full text-left"
              >
                <span className="text-sm font-semibold text-[#23304c]">{area.titulo}</span>
                {area.descricao ? (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {area.descricao}
                  </span>
                ) : null}
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-secondary-foreground">
                  {marcados}/{idsArea.length} itens
                </span>
              </button>

              <ul className="space-y-2">
                {area.secoes.map((secao) => (
                  <li key={secao.id}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-2.5 rounded-lg px-1 py-1 transition-colors hover:bg-white",
                      )}
                    >
                      <Checkbox
                        checked={Boolean(selecao[secao.id])}
                        onCheckedChange={() => onToggle(secao.id)}
                        className="mt-0.5"
                      />
                      <span className="text-sm leading-snug text-foreground">{secao.label}</span>
                    </label>

                    {secao.hasPeriodo && selecao[secao.id] ? (
                      <div
                        data-print-hide
                        className="ml-7 mt-2 space-y-1.5 rounded-lg border border-gray-200/80 bg-white p-2.5"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Período
                        </p>
                        <div className="flex flex-col gap-1">
                          {PERIODOS_EVENTOS_RELATORIO.map((opcao) => (
                            <label
                              key={opcao.value}
                              className="flex cursor-pointer items-center gap-2 text-sm"
                            >
                              <input
                                type="radio"
                                name="periodo-eventos-relatorio"
                                value={opcao.value}
                                checked={periodoEventos === opcao.value}
                                onChange={() => onPeriodoEventosChange(opcao.value)}
                                className="accent-[#23304c]"
                              />
                              {opcao.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
