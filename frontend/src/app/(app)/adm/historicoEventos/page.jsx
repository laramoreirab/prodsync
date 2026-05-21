"use client"

import { ParadasComparadasWidget } from "@/features/eventos/ParadasComparadasWidget";
import { TopMotivosTempoWidget } from "@/features/eventos/TopMotivosTempoWidget";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";

import { Plus, Search, Pencil, EyeIcon, BellRing } from "lucide-react";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";
import { DataEvento } from "@/components/ui/dataEvento";

import { useState, useMemo, useEffect } from "react";
import { useEventos } from "@/hooks/useEventos";

import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import FilterDropdown from "@/components/ui/filterDropdown";
import OrdenarDropdown from "@/components/ui/ordenarDropdown";
import {
  filtrarPorDataInicio,
  filtrarPorDuracaoMax,
  duracaoEmMinutos,
} from "@/lib/filterUtils";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEvento";
import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
import FormEdicaoEvento from "@/components/ui/forms/historicoEventos/formEdicaoEvento";
import ModalSucessNotificacao from "@/components/ui/forms/historicoEventos/modalSucessNotificacao";

import {
  PageLayout,
  PageHeader,
  SectionDivider,
  FadeUpItem,
  SearchBar,
  FilterRow,
  EmptyState,
  LoadingState,
  WidgetCard,
  ContentGrid,
} from "@/components/AnimatedComponents";


const colunasEventos = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-25 text-center justify-center' },
  { id: 'maquina', key: 'maquina', label: 'Máquina' },
  {
    id: 'tipo', key: 'tipo', label: 'Tipo', className: 'text-center justify-center',
    icone: (valor) => {
      const config = {
        "Setup": { variant: "setup" },
        "Parada": { variant: "parada" },
      };
      const estilo = config[valor] || { variant: "outline", className: "" };
      return (
        <Badge variant={estilo.variant} className="whitespace-nowrap">
          {valor}
        </Badge>
      );
    },
  },
  {
    id: 'data', key: 'data', label: 'Data (Início - Fim)',
    icone: (_, row) => <DataEvento inicio={row.inicio} fim={row.fim} />,
  },
  {
    id: 'duracao', key: 'duracao', label: 'Duração',
    icone: (_, row) => <DuracaoEvento inicio={row.inicio} fim={row.fim} />,
  },
  { id: 'motivo', key: 'motivo', label: 'Motivo' },
  //Mudança na coluna de observação para 
  { 
  id: 'observacao', 
  key: 'observacao', 
  label: 'Observação',
  className: 'max-w-[200px]', 
  icone: (valor) => (
    <span className="block truncate" title={valor}>
      {valor || "-"}
    </span>
  )
},
];


const historicoEventosFilter = [
  { id: "tipo", label: "Tipo", type: "checkbox", options: ["Parada", "Setup"] },
  { id: "data", label: "Data", type: "date-range" },
  { id: "duracao", label: "Duração máx.", type: "time-max" },
];

const opcoesOrdenacao = [
  { label: 'ID Crescente', value: 'id_asc' },
  { label: 'ID Decrescente', value: 'id_desc' },
  { label: 'Data Crescente', value: 'data_asc' },
  { label: 'Data Decrescente', value: 'data_desc' },
  { label: 'Duração Crescente', value: 'duracao_asc' },
  { label: 'Duração Decrescente', value: 'duracao_desc' },
];


export default function HistoricoEventos() {
  const { eventos, loading, error, refresh } = useEventos();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState([]);

  useEffect(() => {
    setDados(eventos);
  }, [eventos]);

  const handleSort = (criterio) => {
    const copia = [...dados];
    copia.sort((a, b) => {
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'maquina') return a.maquina.localeCompare(b.maquina);
      if (criterio === 'data_asc') return new Date(a.inicio) - new Date(b.inicio);
      if (criterio === 'data_desc') return new Date(b.inicio) - new Date(a.inicio);
      if (criterio === 'duracao_asc') return duracaoEmMinutos(a) - duracaoEmMinutos(b);
      if (criterio === 'duracao_desc') return duracaoEmMinutos(b) - duracaoEmMinutos(a);
      return 0;
    });
    setDados(copia);
  };

  const aplicarFiltros = (filtros) => {
    let filtrados = [...eventos];
    if (filtros.tipo?.length > 0) {
      filtrados = filtrados.filter(e => filtros.tipo.includes(e.tipo));
    }

    dadosFiltrados = filtrarPorDataInicio(dadosFiltrados, filtrosSelecionados.data);
    if (filtrosSelecionados.duracao?.max) {
      dadosFiltrados = filtrarPorDuracaoMax(dadosFiltrados, filtrosSelecionados.duracao.max);
    }

    setDados(dadosFiltrados);
  };

  const dadosExibidos = dados.filter((evento) => {
    const termo = busca.toLowerCase();
    return (
      evento.maquina.toLowerCase().includes(termo) ||
      evento.id.toString().includes(termo)
    );
  });

  const paradasJustificadas = useMemo(
    () => dadosExibidos.filter(d => d.justificada === true),
    [dadosExibidos]
  );

  const paradasNaoJustificadas = useMemo(
    () => dadosExibidos.filter(d => d.justificada === false),
    [dadosExibidos]
  );

  const modalJustificativa = (
    <DialogContent>
      <ModalSucessNotificacao />
    </DialogContent>
  );

  const acoesDropdown = (row) => (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
            <EyeIcon strokeWidth={2} className="mr-1 h-4 w-4 text-primary" />
            Ver Detalhes
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <DetalhesEvento eventoId={row.id} />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
            <BellRing className="mr-2 h-4 w-4" />
            Solicitar Justificativa
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <ModalSucessNotificacao />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4 text-primary" />
            Editar Evento
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <FormEdicaoEvento eventoId={row.id} onEdicaoSucesso={refresh} />
        </DialogContent>
      </Dialog>
    </>
  );

  if (loading) {
    return <LoadingState message="Carregando eventos..." />;
  }

  return (
    <PageLayout>

      {/* Título + botão */}
      <PageHeader
        title="Histórico de Eventos"
        action={
          <Dialog>
            <DialogTrigger className="bg-secondary-foreground py-1.5 px-5 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
              <Plus className="mr-2" />
              Registrar Evento
            </DialogTrigger>
            <DialogContent>
              <FormCadastroEvento onCadastroSucesso={refresh} />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Gráficos */}
      <ContentGrid cols={3} className="mt-2">
        <WidgetCard colSpan="md:col-span-1">
          <ParadasComparadasWidget />
        </WidgetCard>
        <WidgetCard colSpan="md:col-span-2">
          <TopMotivosTempoWidget />
        </WidgetCard>
      </ContentGrid>

      {/* Listagem */}
      <SectionDivider title="Listagem" className="mt-4" />

      <Tabs defaultValue="todos" className="w-full">

        {/* Seletor mobile */}
        <Select defaultValue="todos">
          <SelectTrigger className="flex w-fit sm:hidden" size="sm">
            <SelectValue placeholder="Selecione o filtro" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="justificadas">Justificadas</SelectItem>
              <SelectItem value="nao-justificadas">Não Justificadas</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Tabs desktop */}
        <FadeUpItem>
          <TabsList className="hidden sm:flex">
            <TabsTrigger value="todos" className="cursor-pointer">Todos</TabsTrigger>
            <TabsTrigger value="justificadas" className="cursor-pointer">Justificadas</TabsTrigger>
            <TabsTrigger value="nao-justificadas" className="cursor-pointer">Não Justificadas</TabsTrigger>
          </TabsList>
        </FadeUpItem>

        {/* Busca */}
        <SearchBar
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Busque por id do evento ou máquina..."
          className="mt-3"
        />

        {/* Contagem + ordenar/filtrar */}
        <FilterRow
          count={dadosExibidos.length}
          label="eventos"
          actions={
            <>
              <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacao} onSortChange={handleSort} />
              <FilterDropdown filtersConfig={historicoEventosFilter} onApply={aplicarFiltros} />
            </>
          }
        />

        {/* Tab: Todos */}
        <TabsContent value="todos">
          <FadeUpItem>
            {dadosExibidos.length > 0 ? (
              <TableListagens
                data={dadosExibidos}
                columns={colunasEventos}
                enableSelection
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
                solicitarJustificativa={modalJustificativa}
              />
            ) : (
              <EmptyState title="Nenhum evento encontrado" message={`Sem resultados para "${busca}".`} />
            )}
          </FadeUpItem>
        </TabsContent>

        {/* Tab: Justificadas */}
        <TabsContent value="justificadas">
          <FadeUpItem>
            {paradasJustificadas.length > 0 ? (
              <TableListagens
                data={paradasJustificadas}
                columns={colunasEventos}
                enableSelection
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
                solicitarJustificativa={modalJustificativa}
              />
            ) : (
              <EmptyState title="Nenhuma parada justificada encontrada" />
            )}
          </FadeUpItem>
        </TabsContent>

        {/* Tab: Não Justificadas */}
        <TabsContent value="nao-justificadas">
          <FadeUpItem>
            {paradasNaoJustificadas.length > 0 ? (
              <TableListagens
                data={paradasNaoJustificadas}
                columns={colunasEventos}
                enableSelection
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
                solicitarJustificativa={modalJustificativa}
              />
            ) : (
              <EmptyState title="Nenhuma parada não justificada encontrada" />
            )}
          </FadeUpItem>
        </TabsContent>

      </Tabs>
    </PageLayout>
  );
}