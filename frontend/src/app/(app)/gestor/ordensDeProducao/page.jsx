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
import { OPProgressoCell } from "@/features/ordens/OPProgressoCell";


// Layout geral
import { PageLayout, PageHeader, SectionDivider, FadeUpItem, SearchBar, FilterRow, EmptyState, KPIGrid, WidgetCard, ContentGrid } from "@/components/AnimatedComponents";

// Componentes de detalhe
import {
  DetailPageContainer,
  DetailBackLink,
  UserProfileCard,
  DetailSectionTitle,
  DetailWidgetGrid,
  DetailWidgetCard,
  SectionHighlight,
  DetailListingSection,
  DetailActions,
} from "@/components/DetailComponents";

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
        "Media": { className: "border border-sky-500/30 bg-sky-500/10 text-sky-700", icon: <MoveHorizontal className="text-sky-600" /> },
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
        Setup: "bg-[var(--amarelo-setup)] text-amarelo",
        Parada: "bg-vermelho-vivido/10 text-vermelho-vivido",
        "ConcluÃ­da": "bg-blue-500/10 text-blue-600",
      };
      return (
        <Badge variant="outline" className={`whitespace-nowrap ${config[valor] || "bg-[var(--status-neutral-bg)] text-[var(--status-neutral-text)]"} text-sm font-semibold border-none p-2.5`}>
          {valor || "-"}
        </Badge>
      );
    },
  },
  {
    id: "progresso",
    key: "progresso",
    label: "Progresso",
    className: "text-center min-w-[140px]",
    icone: (valor) => <OPProgressoCell valor={valor} />,
  },
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
    <PageLayout>

        <PageHeader title="Ordens de Produção" action={

          <Dialog>
            <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold">
              <Plus className="mr-2" />
              Criar OP
            </DialogTrigger>
            <DialogContent>
              <FormCadastroOp onCadastroSucesso={refresh} />
            </DialogContent>
          </Dialog>

        } />


          {/* GRÁFICOS */}

        <KPIGrid cols={4} className="mt-4">

          <WidgetCard>
            <OPAtivasKPIWidget setorId={setorId} />
          </WidgetCard>

          <WidgetCard>
            <OPAtrasadasKPIWidget setorId={setorId} />
          </WidgetCard>

          <WidgetCard>
            <OPPecasBoasKPIWidget setorId={setorId} />
          </WidgetCard>

          <WidgetCard>
            <OPRefugoKPIWidget setorId={setorId} />
          </WidgetCard>

        </KPIGrid>

        <KPIGrid cols={3} className="mt-4">

          <WidgetCard>
            <OPEficienciaWidget setorId={setorId} />
          </WidgetCard>

          <WidgetCard>
            <OPTopRefugoWidget setorId={setorId} />
          </WidgetCard>

          <WidgetCard>
            <OPCargaSetorWidget setorId={setorId} />
          </WidgetCard>

        </KPIGrid>

        <ContentGrid cols={2} className="mt-6">
          <WidgetCard>
            <OPStatusWidget setorId={setorId} />
          </WidgetCard>
          <WidgetCard>
            <OPConcluidasDiaWidget setorId={setorId} />
          </WidgetCard>
        </ContentGrid>

        <SectionDivider title="OPs" className="mt-8" />

        <SearchBar
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Busque por id ou nome..."
        />

        <FilterRow
          count={dadosExibidos.length}
          label="OPs"
          actions={
            <>
              <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacao} onSortChange={handleSort} />
              <FilterDropdown filtersConfig={filtrosOps} onApply={aplicarFiltros} />
            </>
          }
        />

        <FadeUpItem className="mt-4">
          {dadosExibidos.length > 0 ? (
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
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="cursor-pointer"
                      >
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
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="cursor-pointer"
                      >
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
          ) : (
            <EmptyState
              title="Nenhum resultado encontrado"
              message="Ajuste seus filtros ou termo de busca."
            />
          )}
        </FadeUpItem>
    </PageLayout>
  );
}
