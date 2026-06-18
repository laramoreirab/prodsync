"use client"

import Link from "next/link";

import { Plus, Search, Upload, File, Pencil, Trash2, Clock4, EyeIcon, Loader2 } from "lucide-react";
import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import React, { useState, useEffect } from 'react';
import { useMaquinas } from '@/hooks/useMaquinas';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import FormCadastroMaquina from "@/components/ui/forms/maquinas/formCadastroMaquina";
import FormEdicaoMaquina from "@/components/ui/forms/maquinas/formEdicaoMaquina";
import FormExclusaoMaquina from "@/components/ui/forms/maquinas/formExclusaoMaquina";
//Widget imports - Dashboard
import { MaquinaStatusDonutWidget } from "@/features/maquinas/MaquinaStatusDonutWidget";
import { MaquinasPorSetorWidget } from "@/features/maquinas/MaquinasPorSetorWidget";
import { TempoMedioParadaWidget } from "@/features/maquinas/TempoMedioParadaWidget";
import { ProducaoDefeitosWidget } from "@/features/maquinas/ProducaoDefeitosWidget";
import { MaquinasPorTurnoWidget } from "@/features/maquinas/MaquinasPorTurnoWidget";
import { ProducaoTotalWidget } from "@/features/maquinas/ProducaoTotalWidget";
//imports da listagem
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DataUltimaParada } from "@/components/ui/dataUltimaParada";
//
import {
  PageLayout, PageHeader, SectionDivider,
  StaggerWrapper, FadeUpItem, AnimatedTitle,
  KPIGrid, ContentGrid, WidgetCard,
  SearchBar, FilterRow, EmptyState, LoadingState,
  PageSection,
  AsymmetricGrid,
} from "@/components/AnimatedComponents";



const obterNomeSetor = (maquina) => {
  const setor = maquina?.setor;
  if (!setor) return "";
  if (typeof setor === "string") return setor;
  return setor.nome_setor ?? setor.nome ?? "";
};

const maquinasFilterBase = [
  { id: "setor", label: "Setor", type: "checkbox", options: [] },
  { id: "status", label: "Status", type: "checkbox", options: ["Parada", "Produzindo", "Setup"] },
  { id: "data", label: "Parada", type: "date-range" }
];

const colunasMaquinas = [
  { id: 'id_exibicao_empresa', key: 'id_exibicao_empresa', label: 'ID', className: 'w-20 text-center justify-center' },
  { id: 'nome', key: 'nome', label: 'Nome' },
  { id: 'setor', key: 'setor', label: 'Setor', icone: (valor, row) => obterNomeSetor(row) || "-" },
  {
    id: 'status',
    key: 'status',
    label: 'Status',
    className: 'text-center justify-center',
    icone: (valor) => {
      const config = {
        "Produzindo": { variant: "produzindo" },
        "Setup": { variant: "setup" },
        "Parada": { variant: "parada" }
      };

      const estilo = config[valor] || { variant: "outline", className: "" };
      return (
        <Badge variant={estilo.variant} className={`whitespace-nowrap ${estilo.className}`}>
          {valor}
        </Badge>
      );
    }
  },
  {
    id: 'ultimaParada', key: 'ultimaParada', label: 'Última parada',
    icone: (valor, row) => {
      const eventos = row.historico_eventos;

      const ultimaParada = (eventos && eventos.length > 0)
        ? eventos[0].termino
        : null;

      return <DataUltimaParada ultimaParada={ultimaParada} />;
    }
  },
];

export default function Maquinas() {
  const { maquinas, loading, error, refresh, cadastrarMaquina, editarMaquina, excluirMaquina } = useMaquinas();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [maquinaParaExcluir, setMaquinaParaExcluir] = useState(null);

  const maquinasFilter = maquinasFilterBase.map((filter) =>
    filter.id === "setor"
      ? {
        ...filter,
        options: [...new Set(maquinas.map(obterNomeSetor).filter(Boolean))],
      }
      : filter
  );

  //sincronizar dados da API com estado local
  useEffect(() => {
    setDados(maquinas);
  }, [maquinas]);

  //lógica de ordenação
  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      if (criterio === 'nome') return a.nome.localeCompare(b.nome);
      if (criterio === 'id_asc') return Number(a.id_exibicao_empresa ?? a.id_maquina) - Number(b.id_exibicao_empresa ?? b.id_maquina);
      if (criterio === 'id_desc') return Number(b.id_exibicao_empresa ?? b.id_maquina) - Number(a.id_exibicao_empresa ?? a.id_maquina);
      if (criterio === 'setor') return obterNomeSetor(a).localeCompare(obterNomeSetor(b));
      return 0;
    });

    setDados(dadosCopiados);
  };

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...maquinas];

    //filtro por status
    if (filtrosSelecionados.status && filtrosSelecionados.status.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(maq =>
        filtrosSelecionados.status.includes(maq.status)
      );
    }

    if (filtrosSelecionados.setor?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter((maq) =>
        filtrosSelecionados.setor.includes(obterNomeSetor(maq))
      );
    }

    //filtro por data (dia, literalmente, não é data de dados)
    if (filtrosSelecionados.data) {
      if (filtrosSelecionados.data.start) {
        dadosFiltrados = dadosFiltrados.filter(maq =>
          new Date(maq.data) >= new Date(filtrosSelecionados.data.start)
        );
      }
      if (filtrosSelecionados.data.end) {
        dadosFiltrados = dadosFiltrados.filter(maq =>
          new Date(maq.data) <= new Date(filtrosSelecionados.data.end)
        );
      }
    }

    setDados(dadosFiltrados);
  };

  const opcoesOrdenacao = [
    { label: 'Ordem Alfabética', value: 'nome' },
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'Setor', value: 'setor' }
  ];

  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((maq) => {
    const termo = busca.toLowerCase();
    return (
      maq.nome.toLowerCase().includes(termo) ||
      String(maq.id_exibicao_empresa ?? maq.id_maquina).includes(termo)
    );
  });

  //tela de carregamento enquanto busca os dados da API
  if (loading) {
    return <LoadingState message="Sincronizando máquinas..." />;
  }

  return (
    <PageLayout>
      <PageHeader title="Máquinas" action={
        <Dialog>
          <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
            <Plus className="mr-2" />
            Cadastrar
          </DialogTrigger>

          <FormCadastroMaquina onCadastroSucesso={refresh} />
        </Dialog>
      } />


      {/* Gráficos */}
      <AsymmetricGrid className="mt-6">
        <WidgetCard>
          <ProducaoTotalWidget />
        </WidgetCard>
        <WidgetCard >
          <MaquinaStatusDonutWidget />
        </WidgetCard>
      </AsymmetricGrid>

      <ContentGrid cols={2} className="mt-6">
        <WidgetCard>
          <ProducaoDefeitosWidget />
        </WidgetCard>
        <WidgetCard>
          <MaquinasPorTurnoWidget />
        </WidgetCard>
      </ContentGrid>

      <KPIGrid cols={2} className="mt-6">
        <WidgetCard>
          <TempoMedioParadaWidget />
        </WidgetCard>
        <WidgetCard>
          <MaquinasPorSetorWidget />
        </WidgetCard>
      </KPIGrid>

      {/* LISTAGEM MAQUINAS */}
      <SectionDivider title="Inventário de Máquinas" className="mt-8" />

      <SearchBar
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Busque por nome ou id..."
      />

      <FilterRow
        count={dadosExibidos.length}
        label="máquinas"
        actions={
          <>
            <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacao} onSortChange={handleSort} />
            <FilterDropdown filtersConfig={maquinasFilter} onApply={aplicarFiltros} />
          </>
        }
      />

      <FadeUpItem className="mt-4">
        {dadosExibidos.length > 0 ? (
          <div className="w-full overflow-x-auto">


              <TableListagens
                data={dadosExibidos} columns={colunasMaquinas}
                acoesDropdown={(maquina) => (
                  <>

                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`maquinas/${maquina.id_maquina}`}>
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
                      <DialogContent>
                        <FormEdicaoMaquina maquinaId={maquina.id_maquina} onEdicaoSucesso={refresh} />
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
                        <FormExclusaoMaquina
                          maquinaId={maquina.id_maquina}
                          onExcluir={excluirMaquina}
                        />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              />
          </div>
        ) : (
          <EmptyState
            title="Nenhuma máquina encontrada"
            message={`Não encontramos nenhum resultado para "${busca}".`}
          />
        )}
      </FadeUpItem>

      <Dialog
        open={maquinaParaExcluir != null}
        onOpenChange={(open) => {
          if (!open) setMaquinaParaExcluir(null);
        }}
      >
        <DialogContent>
          {maquinaParaExcluir != null && (
            <FormExclusaoMaquina
              key={maquinaParaExcluir}
              maquinaId={maquinaParaExcluir}
              onExcluir={excluirMaquina}
              onExclusaoSucesso={() => setMaquinaParaExcluir(null)}
            />
          )}
        </DialogContent>
      </Dialog>

    </PageLayout>
  );
}
