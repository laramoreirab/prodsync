"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDown,
  EyeIcon,
  Flame,
  Loader2,
  MoveHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { OPAtivasKPIWidget } from "@/features/ordens/OPAtivasKPIWidget";
import { OPAtrasadasKPIWidget } from "@/features/ordens/OPAtrasadasKPIWidget";
import { OPPecasBoasKPIWidget } from "@/features/ordens/OPPecasBoasKPIWidget";
import { OPRefugoKPIWidget } from "@/features/ordens/OPRefugoKPIWidget";
import { OPEficienciaWidget } from "@/features/ordens/OPEficienciaWidget";
import { OPTopRefugoWidget } from "@/features/ordens/OPTopRefugoWidget";
import { OPCargaSetorWidget } from "@/features/ordens/OPCargaSetorWidget";
import { OPStatusWidget } from "@/features/ordens/OPStatusWidget";
import { OPConcluidasDiaWidget } from "@/features/ordens/OPConcluidasDiaWidget";
import { useOps } from "@/hooks/useOps";
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import FormExclusaoOp from "@/components/ui/forms/ops/formExclusaoOp";
import FormCadastroOp from "@/components/ui/forms/ops/formCadastroOp";
import FormEdicaoOp from "@/components/ui/forms/ops/formEdicaoOp";

const opsFilter = [
  { id: "setor", label: "Setor", type: "checkbox", options: ["Roscas", "Engrenagens"] },
  { id: "status_op", label: "Status", type: "checkbox", options: ["Aguardando", "Concluida", "Produzindo", "Parada", "Setup"] },
  { id: "prioridade", label: "Prioridade", type: "checkbox", options: ["Critica", "Alta", "Media", "Baixa"] },
  { id: "progresso", label: "Progresso", type: "number-range" },
];

const colunasOrdemProd = [
  { id: "id", key: "id", label: "ID", className: "w-1/7" },
  { id: "codigo_lote", key: "codigo_lote", label: "Lote", className: "w-1/5" },
  { id: "produto", key: "produto", label: "Produto", className: "w-1/5" },
  {
    id: "prioridade",
    key: "prioridade",
    label: "Prioridade",
    className: "w-45",
    icone: (valor) => {
      const config = {
        Media: { className: "border border-[var(--azul-cobalto)]", icon: <MoveHorizontal className="text-azul-cobalto" /> },
        Alta: { className: "border border-[var(--amarelo)] bg-transparent", icon: <AlertTriangle className="text-amarelo" /> },
        Critica: { className: "border border-[var(--vermelho-vivido)] bg-transparent text-black", icon: <Flame className="text-vermelho-vivido" /> },
        Baixa: { className: "border border-gray-400 text-sm bg-transparent text-black", icon: <ArrowDown className="text-gray-400" /> },
      };
      const item = config[valor] || { icon: null, className: "" };
      return (
        <Badge variant="outline" className={`whitespace-nowrap ${item.className} text-sm font-medium p-2.5`}>
          {item.icon}
          {valor || "-"}
        </Badge>
      );
    },
  },
  { id: "setor", key: "setor", label: "Setor", className: "w-1/5" },
  {
    id: "status_op",
    key: "status_op",
    label: "Status",
    className: "text-center",
    icone: (valor) => {
      const config = {
        "Produzindo": {
          variant: "outline",
          className: "!border-green-500/30 !bg-green-100 !text-green-800 text-sm font-semibold border-none dark:!border-green-300/35 dark:!bg-green-300/20 dark:!text-green-100"
        },
        "Setup": {
          variant: "secondary",
          className: "!border-amber-300 !bg-amber-100 !text-amber-900 text-sm font-semibold border-none dark:!border-amber-300/45 dark:!bg-amber-300/20 dark:!text-amber-100"
        },
        "Parada": {
          variant: "destructive",
          className: "!border-red-500/30 !bg-red-100 !text-red-800 text-sm font-semibold border-none dark:!border-red-300/35 dark:!bg-red-500/20 dark:!text-red-100"
        },
        "Concluída": {
          variant: "outline",
          className: "!border-blue-300 !bg-blue-100 !text-blue-600 text-sm font-semibold border-none dark:!border-blue-300/45 dark:!bg-blue-300/20 dark:!text-blue-100"
        },
        "Aguardando Início": {
          variant: "outline",
          className: "!bg-[#ECECEC] !text-[#636F87] !border-slate-500/30 text-sm font-semibold border-none dark:!border-slate-300/45 dark:!bg-slate-300/20 dark:!text-slate-100"
        }
      };
      const item = config[valor] || { icon: null };
      return (
        <Badge variant="outline" className={`whitespace-nowrap ${config[valor] || "bg-[#ECECEC] text-[#636F87]"} text-sm font-semibold border-none p-2.5`}>
          {valor || "-"}
        </Badge>
      );
    },
  },
  { id: "progresso", key: "progresso", label: "Progresso", className: "text-center" },
];

const opcoesOrdenacao = [
  { label: "ID Crescente", value: "id_asc" },
  { label: "ID Decrescente", value: "id_desc" },
  { label: "Progresso Crescente", value: "progresso_asc" },
  { label: "Progresso Decrescente", value: "progresso_desc" },
];

function numeroProgresso(valor) {
  return Number(String(valor ?? "0").replace("%", ""));
}

export default function OrdensDeProducao() {
  const { ops, loading, refresh } = useOps();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState([]);

  useEffect(() => {
    setDados(ops || []);
  }, [ops]);

  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      if (criterio === "id_asc") return Number(a.id) - Number(b.id);
      if (criterio === "id_desc") return Number(b.id) - Number(a.id);
      if (criterio === "progresso_asc") return numeroProgresso(a.progresso) - numeroProgresso(b.progresso);
      if (criterio === "progresso_desc") return numeroProgresso(b.progresso) - numeroProgresso(a.progresso);
      return 0;
    });

    setDados(dadosCopiados);
  };

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...(ops || [])];

    if (filtrosSelecionados.status_op?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter((op) => filtrosSelecionados.status_op.includes(op.status_op));
    }

    if (filtrosSelecionados.setor?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter((op) => filtrosSelecionados.setor.includes(op.setor));
    }

    if (filtrosSelecionados.prioridade?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter((op) => filtrosSelecionados.prioridade.includes(op.prioridade));
    }

    if (filtrosSelecionados.progresso) {
      const { min, max } = filtrosSelecionados.progresso;
      if (min !== undefined) {
        dadosFiltrados = dadosFiltrados.filter((op) => numeroProgresso(op.progresso) >= Number(min));
      }
      if (max !== undefined) {
        dadosFiltrados = dadosFiltrados.filter((op) => numeroProgresso(op.progresso) <= Number(max));
      }
    }

    setDados(dadosFiltrados);
  };

  const dadosExibidos = dados.filter((op) => {
    const termo = busca.toLowerCase();
    return (
      String(op?.id || "").includes(termo) ||
      String(op?.codigo_lote || "").toLowerCase().includes(termo) ||
      String(op?.produto || "").toLowerCase().includes(termo)
    );
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-900 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Carregando ordens de producao...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full mt-8 pb-10 px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
            Ordens de Producao
          </h1>
          <Dialog>
            <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold">
              <Plus className="mr-2" />
              Criar OP
            </DialogTrigger>
            <DialogContent>
              <FormCadastroOp onCadastroSucesso={refresh} />
            </DialogContent>
          </Dialog>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white border rounded-xl p-4"><OPAtivasKPIWidget /></div>
          <div className="bg-white border rounded-xl p-4"><OPAtrasadasKPIWidget /></div>
          <div className="bg-white border rounded-xl p-4"><OPPecasBoasKPIWidget /></div>
          <div className="bg-white border rounded-xl p-4"><OPRefugoKPIWidget /></div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-6"><OPEficienciaWidget /></div>
          <div className="bg-white border rounded-xl p-6"><OPTopRefugoWidget /></div>
          <div className="bg-white border rounded-xl p-6"><OPCargaSetorWidget /></div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border rounded-xl p-6 md:col-span-2"><OPStatusWidget /></div>
          <div className="bg-white border rounded-xl p-6 md:col-span-3"><OPConcluidasDiaWidget /></div>
        </section>

        <section id="listagem_ops">
          <div className="flex items-center py-8 gap-5">
            <h2 className="text-4xl font-semibold">OPs</h2>
            <hr className="bg-black flex-1 h-1" />
          </div>

          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none bg-transparent"
                placeholder="Busque por id, lote ou produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <button className="outline-none cursor-pointer mr-2">
                <Search />
              </button>
            </div>
          </div>

          <div className="row_ord_fil_cont flex items-center py-3 justify-between mt-3">
            <p>{dadosExibidos.length} OPs encontradas</p>
            <div className="flex items-center gap-4">
              <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacao} onSortChange={handleSort} />
              <FilterDropdown filtersConfig={opsFilter} onApply={aplicarFiltros} />
            </div>
          </div>

          <TableListagens
            data={dadosExibidos}
            columns={colunasOrdemProd}
            enableSelection
            onSelectedChange={setSelecionados}
            excluirLote={
              <DialogContent>
                <FormExclusaoOp
                  opIds={selecionados.map((op) => op.id ?? op.id_ordem)}
                  onExclusaoSucesso={refresh}
                />
              </DialogContent>
            }
            acoesDropdown={(op) => (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`/adm/ordensDeProducao/${op.id}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Link>
                </DropdownMenuItem>

                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4 text-primary" />
                      Editar OP
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <FormEdicaoOp opId={op.id} onEdicaoSucesso={refresh} />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4 text-vermelho-vivido" />
                      Excluir
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <FormExclusaoOp opId={op.id} idMaquina={op.id_maquina} onExclusaoSucesso={refresh} />
                  </DialogContent>
                </Dialog>
              </>
            )}
          />
        </section>
      </div>
    </main>
  );
}
