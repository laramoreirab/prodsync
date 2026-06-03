import { AlertTriangle, ArrowDown, Flame, MoveHorizontal } from "lucide-react";

const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]/g, " ")
    .trim()
    .toLowerCase();

export function normalizeOrdemStatus(status) {
  const value = normalizeText(status);

  if (!value) return "-";
  if (["produzindo", "em andamento", "em producao", "em producao"].includes(value)) {
    return "Produzindo";
  }
  if (["setup", "pausadas setup", "pausado setup"].includes(value)) {
    return "Setup";
  }
  if (["concluida", "finalizada", "finalizado"].includes(value)) {
    return "Concluída";
  }
  if (["aguardando inicio", "aguardando", "em espera"].includes(value)) {
    return "Aguardando Início";
  }
  if (["parada", "pausadas", "atrasadas", "atrasada"].includes(value)) {
    return "Parada";
  }

  return String(status);
}

export function getOrdemStatusBadgeClass(status) {
  const normalized = normalizeOrdemStatus(status);

  const styles = {
    Produzindo: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
    Setup: "bg-amber-500/15 text-amber-900 border-amber-500/20",
    Parada: "bg-rose-500/15 text-rose-700 border-rose-500/20",
    "Concluída": "bg-sky-500/15 text-sky-700 border-sky-500/20",
    "Aguardando Início": "bg-slate-500/15 text-slate-700 border-slate-500/20",
  };

  return styles[normalized] || "bg-slate-100 text-slate-700 border-slate-200";
}

export function normalizePrioridade(prioridade) {
  const value = normalizeText(prioridade);

  if (value === "critica") return "Crítica";
  if (value === "alta") return "Alta";
  if (value === "media") return "Média";
  if (value === "baixa") return "Baixa";
  return String(prioridade ?? "");
}

export function getPrioridadeBadgeConfig(prioridade) {
  const normalized = normalizePrioridade(prioridade);

  const config = {
    "Crítica": {
      className: "border-rose-500/30 bg-rose-500/10 text-rose-700",
      icon: Flame,
      iconClassName: "text-rose-600",
    },
    Alta: {
      className: "border-amber-500/30 bg-amber-500/10 text-amber-700",
      icon: AlertTriangle,
      iconClassName: "text-amber-600",
    },
    "Média": {
      className: "border-sky-500/30 bg-sky-500/10 text-sky-700",
      icon: MoveHorizontal,
      iconClassName: "text-sky-600",
    },
    Baixa: {
      className: "border-slate-400/30 bg-slate-100 text-slate-700",
      icon: ArrowDown,
      iconClassName: "text-slate-400",
    },
  };

  return {
    label: normalized || "-",
    ...config[normalized],
  };
}
