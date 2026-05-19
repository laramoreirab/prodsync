"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowDown, EyeIcon, Flame, Loader2, MoveHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";

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
import { usePerfil } from "@/hooks/usePerfil";

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
        "Media": { className: "border border-[var(--azul-cobalto)]", icon: <MoveHorizontal className="text-azul-cobalto" /> },
        "MÃ©dia": { className: "border border-[var(--azul-cobalto)]", icon: <MoveHorizontal className="text-azul-cobalto" /> },
        Alta: { className: "border border-[var(--amarelo)] bg-transparent", icon: <AlertTriangle className="text-amarelo" /> },
        Critica: { className: "border border-[var(--vermelho-vivido)] bg-transparent text-black", icon: <Flame className="text-vermelho-vivido" /> },
        "CrÃ­tica": { className: "border border-[var(--vermelho-vivido)] bg-transparent text-black", icon: <Flame className="text-vermelho-vivido" /> },
        Baixa: { className: "border border-gray-400 text-sm bg-transparent text-black", icon: <ArrowDown className="text-gray-400" /> },
      };
      const item = config[valor] || { icon: null, className: "" };
      return (
        <Badge variant="outline" className={`whitespace-nowrap ${item.className} text-sm font-medium p-2.5`}>
          {item.icon}
          {valor}
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
        Produzindo: "bg-green-500/15 text-green-600",
        Setup: "bg-[#fffbea] text-amarelo",
        Parada: "bg-vermelho-vivido/10 text-vermelho-vivido",
        "ConcluÃ­da": "bg-blue-500/10 text-blue-600",
      };
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
  { label: "Prioridade", value: "prioridade" },
  { label: "Status", value: "status" },
];

const filtrosOps = [
  { id: "status_op", label: "Status", type: "checkbox", options: ["Produzindo", "Setup", "Parada", "ConcluÃ­da"] },
  { id: "prioridade", label: "Prioridade", type: "checkbox", options: ["Baixa", "Media", "MÃ©dia", "Alta", "Critica", "CrÃ­tica"] },
];

export default function OrdensDeProducaoGestor() {
  const { setorId } = usePerfil();
  const { ops, loading, refresh } = useOps();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState([]);

  const opsDoSetor = useMemo(() => {
    return (ops || []).filter((op) => !setorId || String(op.id_setor) === String(setorId));
  }, [ops, setorId]);

  useEffect(() => {
    setDados(opsDoSetor);
  }, [opsDoSetor]);

  const handleSort = (criterio) => {
    const ordenado = [...dados].sort((a, b) => {
      if (criterio === "id_asc") return Number(a.id) - Number(b.id);
      if (criterio === "id_desc") return Number(b.id) - Number(a.id);
      if (criterio === "prioridade") return String(a.prioridade).localeCompare(String(b.prioridade));
      if (criterio === "status") return String(a.status_op).localeCompare(String(b.status_op));
      return 0;
    });
    setDados(ordenado);
  };

  const aplicarFiltros = (filtrosSelecionados) => {
    let filtrados = [...opsDoSetor];
    if (filtrosSelecionados.status_op?.length > 0) {
      filtrados = filtrados.filter((op) => filtrosSelecionados.status_op.includes(op.status_op));
    }
    if (filtrosSelecionados.prioridade?.length > 0) {
      filtrados = filtrados.filter((op) => filtrosSelecionados.prioridade.includes(op.prioridade));
    }
    setDados(filtrados);
  };

  const dadosExibidos = dados.filter((op) => {
    const termo = busca.toLowerCase();
    return String(op.id).includes(termo) || op.codigo_lote?.toLowerCase().includes(termo) || op.produto?.toLowerCase().includes(termo);
  });

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-900 w-12 h-12" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="p-8">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between mb-6">
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

          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-xl p-4 h-24"><OPAtivasKPIWidget setorId={setorId} /></div>
            <div className="bg-white border rounded-xl p-4 h-24"><OPAtrasadasKPIWidget setorId={setorId} /></div>
            <div className="bg-white border rounded-xl p-4 h-24"><OPPecasBoasKPIWidget setorId={setorId} /></div>
            <div className="bg-white border rounded-xl p-4 h-24"><OPRefugoKPIWidget setorId={setorId} /></div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl p-6"><OPEficienciaWidget setorId={setorId} /></div>
            <div className="bg-white border rounded-xl p-6"><OPTopRefugoWidget setorId={setorId} /></div>
            <div className="bg-white border rounded-xl p-6"><OPCargaSetorWidget setorId={setorId} /></div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white border rounded-xl p-6 md:col-span-2"><OPStatusWidget setorId={setorId} /></div>
            <div className="bg-white border rounded-xl p-6 md:col-span-3"><OPConcluidasDiaWidget setorId={setorId} /></div>
          </section>
        </div>

        <section>
          <div className="flex items-center py-8 gap-5">
            <h2 className="text-4xl w-30 font-semibold">OPs</h2>
            <hr className="bg-black flex-1 h-1" />
          </div>

          <div className="flex searchbar mb-3">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full font-medium outline-none bg-transparent"
                placeholder="Busque por id, lote ou produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <button className="outline-none cursor-pointer mr-2"><Search /></button>
            </div>
          </div>

          <div className="row_ord_fil_cont flex items-center justify-between mt-3 mb-4">
            <p>{dadosExibidos.length} OPs encontradas</p>
            <div className="flex items-center gap-4">
              <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacao} onSortChange={handleSort} />
              <FilterDropdown filtersConfig={filtrosOps} onApply={aplicarFiltros} />
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
                  <Link href={`ordensDeProducao/${op.id}`}>
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
                    <FormExclusaoOp
                      opId={op.id}
                      idMaquina={op.id_maquina}
                      onExclusaoSucesso={refresh}
                    />
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
