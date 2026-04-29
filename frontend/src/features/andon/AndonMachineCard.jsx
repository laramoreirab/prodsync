"use client";

import { CheckCircle2, TriangleAlert, Wrench } from "lucide-react";

const statusMeta = {
  emProducao: {
    label: "Em produção",
    accent: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
    Icon: CheckCircle2,
  },
  emSetup: {
    label: "Setup",
    accent: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700",
    Icon: Wrench,
  },
  emParada: {
    label: "Parada",
    accent: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700",
    Icon: TriangleAlert,
  },
};

export function AndonMachineCard({ machine }) {
  const meta = statusMeta[machine.status];
  const StatusIcon = meta.Icon;

  return (
    <article
      aria-label={`${machine.codigo} ${meta.label}`}
      className="w-[252px] shrink-0 cursor-default select-none overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className={`h-1.5 w-full ${meta.accent}`} />

      <div className="flex min-h-[232px] flex-col px-4 pb-4 pt-3">
        <div className="border-b border-slate-100 pb-3">
          <p className="text-sm font-semibold text-slate-950">{machine.codigo}</p>
        </div>

        <dl className="mt-3 grid gap-1.5 text-sm text-slate-600">
          <div className="grid grid-cols-[auto_1fr] gap-x-1">
            <dt className="font-semibold text-slate-800">Status:</dt>
            <dd className="break-words">{meta.label}</dd>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-1">
            <dt className="font-semibold text-slate-800">Operador:</dt>
            <dd className="break-words">{machine.operador}</dd>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-1">
            <dt className="font-semibold text-slate-800">{machine.detalheLabel}:</dt>
            <dd className="break-words">{machine.detalheValor}</dd>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-1">
            <dt className="font-semibold text-slate-800">Meta turno:</dt>
            <dd className="break-words">{machine.metaTurno}</dd>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-1">
            <dt className="font-semibold text-slate-800">Meta dia:</dt>
            <dd className="break-words">{machine.metaDia}</dd>
          </div>
        </dl>

        <div className="mt-auto space-y-3 pt-4">
          <div className="border-t border-slate-100 pt-3 text-center text-sm font-semibold text-slate-900">
            OEE: {machine.oee}%
          </div>

          <div className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium ${meta.badge}`}>
            <StatusIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="break-words">{machine.tempoStatus}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
