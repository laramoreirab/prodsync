"use client"

import { OPAtivasKPIWidget } from "@/features/ordens/OPAtivasKPIWidget";
import { OPAtrasadasKPIWidget } from "@/features/ordens/OPAtrasadasKPIWidget";
import { OPPecasBoasKPIWidget } from "@/features/ordens/OPPecasBoasKPIWidget";
import { OPRefugoKPIWidget } from "@/features/ordens/OPRefugoKPIWidget";
import { OPEficienciaWidget } from "@/features/ordens/OPEficienciaWidget";
import { OPTopRefugoWidget } from "@/features/ordens/OPTopRefugoWidget";
import { OPCargaSetorWidget } from "@/features/ordens/OPCargaSetorWidget";
import { OPStatusWidget } from "@/features/ordens/OPStatusWidget";
import { OPConcluidasDiaWidget } from "@/features/ordens/OPConcluidasDiaWidget";

import { useState, useEffect } from "react";
import { useOps } from "@/hooks/useOps";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowDown, Flame, Loader2, MoveHorizontal, Pencil, Plus, EyeIcon, Trash2, Search } from 'lucide-react';
import TableListagens from "@/components/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import FormExclusaoOp from "@/components/ui/forms/ops/formExclusaoOp";
import FormCadastroOp from "@/components/ui/forms/ops/formCadastroOp";
import FormEdicaoOp from "@/components/ui/forms/ops/formEdicaoOp";


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
  {
    id: "id",
    key: "id",
    label: "ID",
    className: "w-1/7"
  },
  {
    id: "codigo_lote",
    key: "codigo_lote",
    label: "Nome",
    className: "w-1/5"
  },
  {
    id: "prioridade",
    key: "prioridade",
    label: "Prioridade",
    className: "w-45",
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
  },
  {
    id: "status_op",
    key: "status_op",
    label: 'Status',
    className: "text-center",
    icone: (valor) => {
      const config = {
        "Produzindo": {
          variant: "outline",
          className: "bg-green-500/15 text-green-600 text-sm font-semibold border-none"
        },
        "Setup": {
          variant: "secondary",
          className: "bg-[#fffbea] text-amarelo font-semibold text-sm border-none"
        },
        "Parada": {
          variant: "destructive",
          className: "bg-vermelho-vivido/10 text-vermelho-vivido font-semibold text-sm border-none"
        },
        "Concluída": {
          variant: "outline",
          className: "bg-blue-500/10 text-blue-600 text-sm font-semibold border-none"
        },
        "Aguardando Início": {
          variant: "outline",
          className: "bg-[#ECECEC] text-[#636F87] text-sm font-semibold border-none"
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
  },
  {
    id: "progresso",
    key: "progresso",
    label: "Progresso",
    className: "text-center"
  },
];



export default function OrdensDeProducaoGestor() {
  const { ops, loading, error, refresh } = useOps();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");

  //sincronizar dados da API com estado local
  useEffect(() => {
    setDados(ops);
  }, [ops]);


  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];


    dadosCopiados.sort((a, b) => {
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'progresso_asc') return a.progresso - b.progresso;
      if (criterio === 'progresso_desc') return b.progresso - a.progresso;
      return 0;
    });


    setDados(dadosCopiados);
  };

  const opsFilter = [
    { id: "status_op", label: "Status", type: "checkbox", options: ["Aguardando", "Concluída", "Produzindo", "Parada", "Setup"] },
    { id: "prioridade", label: "Prioridade", type: "checkbox", options: ["Crítica", "Alta", "Média", "Baixa"] },
    { id: "progresso", label: "Progresso", type: "number-range" }
  ];

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...ops]; // usa o estado da API, não array estático


    //filtro por status
    if (filtrosSelecionados.status_op && filtrosSelecionados.status_op.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(op =>
        filtrosSelecionados.status_op.includes(op.status_op)
      );
    }


    //filtro por setor
    if (filtrosSelecionados.setor && filtrosSelecionados.setor.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(op =>
        filtrosSelecionados.setor.includes(op.setor)
      );
    }


    //filtro por prioridade
    if (filtrosSelecionados.prioridade?.length) {
      dadosFiltrados = dadosFiltrados.filter(op =>
        filtrosSelecionados.prioridade.includes(op.prioridade)
      );
    }


    //filtro por progresso (intervalo)
    if (filtrosSelecionados.progresso) {
      const { min, max } = filtrosSelecionados.progresso;
      if (min !== undefined) dadosFiltrados = dadosFiltrados.filter(op => op.progresso >= min);
      if (max !== undefined) dadosFiltrados = dadosFiltrados.filter(op => op.progresso <= max);
    }


    setDados(dadosFiltrados);
  };


  const opcoesOrdenacao = [
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'Progresso Crescente', value: 'progresso_asc' },
    { label: 'Progresso Decrescente', value: 'progresso_desc' },
  ];


  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((op) => {
    const termo = (busca || "").toLowerCase();

    const nome = op?.codigo_lote?.toLowerCase() || "";
    const id = op?.id?.toString() || "";

    return (
      nome.includes(termo) ||
      id.includes(termo)
    );
  });


  //tela de carregamento enquanto busca os dados da API
  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-900 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Carregando ordens de produção...</p>
        </div>
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
            <OPAtivasKPIWidget />
          </WidgetCard>

          <WidgetCard>
            <OPAtrasadasKPIWidget />
          </WidgetCard>

          <WidgetCard>
            <OPPecasBoasKPIWidget />
          </WidgetCard>

          <WidgetCard>
            <OPRefugoKPIWidget />
          </WidgetCard>


        </KPIGrid>

        <KPIGrid cols={3} className="mt-4">

          <WidgetCard>
            <OPEficienciaWidget />
          </WidgetCard>

          <WidgetCard>
            <OPTopRefugoWidget />
          </WidgetCard>

          <WidgetCard>
            <OPCargaSetorWidget />
          </WidgetCard>


        </KPIGrid>

        <ContentGrid cols={2} className="mt-6">
          <WidgetCard>
            <OPStatusWidget />
          </WidgetCard>
          <WidgetCard>
            <OPConcluidasDiaWidget />
          </WidgetCard>
        </ContentGrid>


        {/* Listagem de OPs */}
<SectionDivider title="OPs" className="mt-8" />

          {/* Busca */}
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
            <FilterDropdown filtersConfig={opsFilter} onApply={aplicarFiltros} />
          </>
        }
      />

          {/* Tabela */}
          <FadeUpItem className="mt-4">
          {dadosExibidos.length > 0 ? (
            <TableListagens
              data={dadosExibidos}
              columns={colunasOrdemProd}
              enableSelection={true}
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
                      <FormEdicaoOp opId={op.id} onEdicaoSucesso={refresh}/>
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
                      <FormExclusaoOp opId={op.id}
                      idMaquina={op.id_maquina}
                      onExclusaoSucesso={refresh}/>
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