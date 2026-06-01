"use client";

import React, { useState, useEffect } from "react";
import { OEEPorSetorWidget } from "@/features/setores/OEEPorSetorWidget";
import { RefugoPorSetorWidget } from "@/features/setores/RefugoPorSetorWidget";
import { OEECriticoWidget } from "@/features/setores/OEECriticoWidget";
import { SetorTotalWidget } from "@/features/setores/SetorTotalKPIWidget";
import { OperadoresMediaWidget } from "@/features/setores/OperadoresMediaKPIWidget";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Search, EyeIcon, Pencil, Trash2, Loader2, ChevronDown } from "lucide-react";
import { PlusChevronToggleIcon } from "@/components/ui/PlusChevronToggleIcon";
import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSetores } from "@/hooks/useSetores";
import TableListagens from "@/components/table";
import FormCadastroSetor from '@/components/ui/forms/setores/formCadastroSetor';
import FormCadastroTurnoGeral from '@/components/ui/forms/setores/formCadastroTurnoGeral';
import FormExclusaoSetor from '@/components/ui/forms/setores/formExclusaoSetor';
import FormEdicaoSetor from '@/components/ui/forms/setores/formEdicaoSetor';
import Link from "next/link";

import {
  PageLayout, PageHeader, SectionDivider,
  StaggerWrapper, FadeUpItem, AnimatedTitle,
  KPIGrid, ContentGrid, WidgetCard,
  SearchBar, FilterRow, EmptyState, LoadingState,
  PageSection,
  AsymmetricGrid,
} from "@/components/AnimatedComponents";

const setoresFilter = [
  { id: "nome_setor", label: "Setor", type: "checkbox", options: [] },
  { id: "qtd_de_maquinas", label: "Qtd. de Máquinas", type: "number-range" },
  { id: "qtd_de_operadores", label: "Qtd. de Operadores", type: "number-range" },
];

const colunasSetores = [
  { id: "nome_setor", key: "nome_setor", label: "Setor", className: "w-1/7" },
  { id: "gestor", key: "gestor", label: "Gestor", className: "w-1/5" },
  { id: "oee_medio", key: "oee_medio", label: "OEE Médio", className: "w-45" },
  { id: "qtd_de_maquinas", key: "qtd_de_maquinas", label: "Qtd. de Máquinas", className: "w-1/5" },
  { id: "qtd_de_operadores", key: "qtd_de_operadores", label: "Qtd. de Operadores" },
];

export default function PageSetores() {
  const { setores, loading, error, refresh } = useSetores();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState([]);
  const [criarAberto, setCriarAberto] = useState(null);
  const [menuCriarAberto, setMenuCriarAberto] = useState(false);
  const filtersConfig = setoresFilter.map((filter) =>
    filter.id === "nome_setor"
      ? { ...filter, options: setores.map((setor) => setor.nome_setor).filter(Boolean) }
      : filter
  );

  //sincronizar dados da API com estado local
  useEffect(() => {
    setDados(setores);
  }, [setores]);

  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];
    const parseOEE = (valor) => parseFloat(String(valor).replace("%", ""));

    dadosCopiados.sort((a, b) => {
      switch (criterio) {
        case "nome": return a.nome_setor.localeCompare(b.nome_setor);
        case "oee_asc": return parseOEE(a.oee_medio) - parseOEE(b.oee_medio);
        case "oee_desc": return parseOEE(b.oee_medio) - parseOEE(a.oee_medio);
        case "qtdMaquinas_asc": return a.qtd_de_maquinas - b.qtd_de_maquinas;
        case "qtdMaquinas_desc": return b.qtd_de_maquinas - a.qtd_de_maquinas;
        case "qtdOperadores_asc": return a.qtd_de_operadores - b.qtd_de_operadores;
        case "qtdOperadores_desc": return b.qtd_de_operadores - a.qtd_de_operadores;
        default: return 0;
      }
    });

    setDados(dadosCopiados);
  };

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...setores]; // usa o estado da API, não array estático

    //filtro por setor
    if (filtrosSelecionados.nome_setor && filtrosSelecionados.nome_setor.length > 0) {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        filtrosSelecionados.nome_setor.some(
          (f) => f.toLowerCase() === item.nome_setor.toLowerCase()
        )
      );
    }

    //filtro por qtd de máquinas
    if (filtrosSelecionados.qtd_de_maquinas) {
      const { min, max } = filtrosSelecionados.qtd_de_maquinas;
      dadosFiltrados = dadosFiltrados.filter(
        (item) => item.qtd_de_maquinas >= (min || 0) && item.qtd_de_maquinas <= (max || Infinity)
      );
    }

    //filtro por qtd de operadores
    if (filtrosSelecionados.qtd_de_operadores) {
      const { min, max } = filtrosSelecionados.qtd_de_operadores;
      dadosFiltrados = dadosFiltrados.filter(
        (item) => item.qtd_de_operadores >= (min || 0) && item.qtd_de_operadores <= (max || Infinity)
      );
    }

    setDados(dadosFiltrados);
  };

  const opcoesOrdenacao = [
    { label: "Ordem Alfabética", value: "nome" },
    { label: "OEE Crescente", value: "oee_asc" },
    { label: "OEE Decrescente", value: "oee_desc" },
    { label: "Qtd. Máquinas Crescente", value: "qtdMaquinas_asc" },
    { label: "Qtd. Máquinas Decrescente", value: "qtdMaquinas_desc" },
    { label: "Qtd. Operadores Crescente", value: "qtdOperadores_asc" },
    { label: "Qtd. Operadores Decrescente", value: "qtdOperadores_desc" },
  ];

  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((setor) => {
    const termo = busca.toLowerCase();
    return (
      setor.nome_setor.toLowerCase().includes(termo) ||
      setor.gestor?.toLowerCase().includes(termo)
    );
  });

  //tela de carregamento enquanto busca os dados da API
  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-900 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Carregando setores...</p>
        </div>
      </main>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Setores"
        action={(
          <>
        {/* Título da tela e do botão que leva ao modal de cadastro do setor */}
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
              <PlusChevronToggleIcon className="mr-2" />
              Criar
              <ChevronDown className="ml-2 w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuItem
                className="cursor-pointer text-base font-medium"
                onClick={() => setCriarAberto("setor")}
              >
                Setor
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-base font-medium"
                onClick={() => setCriarAberto("turno")}
              >
                Turno (todos os setores)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={criarAberto === "setor"} onOpenChange={(open) => !open && setCriarAberto(null)}>
            <DialogContent className="top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none rounded-b-lg">
              <FormCadastroSetor onCadastroSucesso={() => { refresh(); setCriarAberto(null); }} />
            </DialogContent>
          </Dialog>

          <Dialog open={criarAberto === "turno"} onOpenChange={(open) => !open && setCriarAberto(null)}>
            <DialogContent>
              <FormCadastroTurnoGeral onSuccess={() => { refresh(); setCriarAberto(null); }} />
            </DialogContent>
          </Dialog>
          </>
        )}
      />

      {/* Gráficos */}

      <AsymmetricGrid className="mt-6">
        <WidgetCard>
          <OEEPorSetorWidget />
        </WidgetCard>
        <div className="flex flex-col justify-between gap-4 h-full">
          <WidgetCard>
            <SetorTotalWidget />
          </WidgetCard>

          <WidgetCard>
            <OperadoresMediaWidget />
          </WidgetCard>
        </div>
      </AsymmetricGrid>
      
      <ContentGrid cols={2} className="mt-6">
        <WidgetCard>
          <RefugoPorSetorWidget />
        </WidgetCard>
        <WidgetCard>
          <OEECriticoWidget />
        </WidgetCard>
      </ContentGrid>

      {/* Listagem */}

      <SectionDivider title="Listagem de Setores" className="mt-8" />

      {/* Busca */}

      <SearchBar
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Busque por nome ou gestor..."
      />

      {/* Linha de quantidade total de setores e filtrar e ordenar */}
      <FilterRow
        count={dadosExibidos.length}
        label="setores"
        actions={
          <>
            <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacao} onSortChange={handleSort} />
            <FilterDropdown filtersConfig={filtersConfig} onApply={aplicarFiltros} />
          </>
        }
      />

      <FadeUpItem className="mt-4">
        {dadosExibidos.length > 0 ? (
          <TableListagens
            data={dadosExibidos}
            columns={colunasSetores}
            enableSelection={true}
            onSelectedChange={setSelecionados}
            excluirLote={
              <DialogContent>
                <FormExclusaoSetor />
              </DialogContent>
            }
            acoesDropdown={(setor) => (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`setores/${setor.id_setor}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Link>
                </DropdownMenuItem>

                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4 text-primary" />
                      Editar
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none rounded-b-lg">
                    <FormEdicaoSetor setorId={setor.id_setor} onEdicaoSucesso={refresh} />
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
                    <FormExclusaoSetor setorId={setor.id_setor} onExclusaoSucesso={refresh} />
                  </DialogContent>
                </Dialog>
              </>
            )}
          />
        ) : (
          <EmptyState
            title="Nenhum setor encontrado"
            message={`Não encontramos nenhum resultado para "${busca}".`}
          />
        )}
      </FadeUpItem>
    </PageLayout >
  );
}
