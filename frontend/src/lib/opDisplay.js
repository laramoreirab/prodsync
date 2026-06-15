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
    return "Produzindo";
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
    "Média": {
      variant: "outline",
      className: "border border-[var(--azul-cobalto)]",
      icon: <MoveHorizontal className="text-azul-cobalto" />
    },
    "Alta": {
      variant: "secondary",
      className: "border border-[var(--amarelo)] bg-transparent",
      icon: <AlertTriangle className="text-amarelo" />
    },
    "Crítica": {
      variant: "destructive",
      className: "border border-[var(--vermelho-vivido)] bg-transparent text-black",
      icon: <Flame className="text-vermelho-vivido" />
    },
    "Baixa": {
      variant: "destructive",
      className: "border border-gray-400 text-sm bg-transparent text-black",
      icon: <ArrowDown className="text-gray-400" />
    }
  };

  icone: (valor) => {
    const config = {
      "Média": {
        variant: "outline",
        className: "border border-[var(--azul-cobalto)]",
        icon: <MoveHorizontal className="text-azul-cobalto" />
      },
      "Alta": {
        variant: "secondary",
        className: "border border-[var(--amarelo)] bg-transparent",
        icon: <AlertTriangle className="text-amarelo" />
      },
      "Crítica": {
        variant: "destructive",
        className: "border border-[var(--vermelho-vivido)] bg-transparent text-black",
        icon: <Flame className="text-vermelho-vivido" />
      },
      "Baixa": {
        variant: "destructive",
        className: "border border-gray-400 text-sm bg-transparent text-black",
        icon: <ArrowDown className="text-gray-400" />
      }
    };


    const item = config[valor] || { icon: null };
    return (
      <Badge variant="outline" className={`whitespace-nowrap ${item.className} text-sm font-medium p-2.5`}>
        {item.icon}
        {valor}
      </Badge>
    );
  }

  return {
    label: normalized || "-",
    ...config[normalized],
  };
}
