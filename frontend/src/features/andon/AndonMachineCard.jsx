"use client";

import { CheckCircle2, TriangleAlert, Wrench } from "lucide-react";

const statusMeta = {
  emProducao: {
    label: "Em produÃ§Ã£o",
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
  const oeePercentage = Math.max(0, Math.min(machine.oee, 100));

  return (
    <article
      aria-label={`${machine.codigo} ${meta.label}`}
      className="w-63 shrink-0 cursor-default select-none overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">


      <div className="flex min-h-58 flex-col  pb-4 pt-3">
        <div className="border-b border-slate-100 pb-2">
          <p className="text-md font-semibold px-4 text-slate-950">{machine.codigo}</p>
        </div>

        <div className={`h-1.5 w-full ${meta.accent}`} />

        <dl className="mt-3 grid gap-1.5 text-sm text-slate-600 px-4">
          <div className="grid grid-cols-[auto_1fr] gap-x-1">
            <dt className="font-semibold text-slate-800">Status:</dt>
            <dd className="wrap-break-word">{meta.label}</dd>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-1">
            <dt className="font-semibold text-slate-800">Operador:</dt>
            <dd className="wrap-break-word">{machine.operador}</dd>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-1">
            <dt className="font-semibold text-slate-800">{machine.detalheLabel}:</dt>
            <dd className="wrap-break-word">{machine.detalheValor}</dd>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-1">
            <dt className="font-semibold text-slate-800">Meta:</dt>
            <dd className="wrap-break-word">{machine.metaDia}</dd>
          </div>
        </dl>

        <div className="mt-auto space-y-3 px-4 pt-4">
          <div className=" pt-3">
            <div
              aria-label={`OEE de ${machine.oee}%`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={oeePercentage}
              className="relative h-5 overflow-hidden rounded-sm bg-slate-200"
              role="progressbar">
              <div
                className="absolute inset-y-0 left-0 bg-[var(--chart-progress)] transition-[width]"
                style={{ width: `${oeePercentage}%` }}
              />
            </div>
          </div>

          <p className="text-center text-sm font-semibold px-4">OEE: {machine.oee}%</p>

          <div className={`inline-flex items-center gap-2 rounded-md px-2.5  py-1 text-xs font-medium ${meta.badge}`}>
            <StatusIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="wrap-break-word">{machine.tempoStatus}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
