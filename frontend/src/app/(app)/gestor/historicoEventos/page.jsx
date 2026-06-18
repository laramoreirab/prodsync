"use client";

import { useEffect, useMemo, useState } from "react";
import { EyeIcon, Pencil, Plus, Search } from "lucide-react";

import { ParadasComparadasWidget } from "@/features/eventos/ParadasComparadasWidget";
import { TopMotivosTempoWidget } from "@/features/eventos/TopMotivosTempoWidget";
import { useEventos } from "@/hooks/useEventos";
import { usePerfil } from "@/hooks/usePerfil";
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";
import { DataEvento } from "@/components/ui/dataEvento";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEventoGestor";
import FormEdicaoEvento from "@/components/ui/forms/historicoEventos/formEdicaoEvento";
import { SolicitarJustificativaMenuItem, SolicitarJustificativaConteudo } from "@/components/ui/forms/historicoEventos/solicitarJustificativaDialog";
import { BellRing } from "lucide-react";
import FormCadastroEventoGestor from "@/components/ui/forms/historicoEventos/formCadastroEventoGestor";

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
  { id: "numero_evento", key: "numero_evento", label: "ID", className: "w-10 text-center justify-center" },
  { id: "nome", key: "nome", label: "Nome", className: "w-1/9" },
  {
    id: "status",
    key: "status",
    label: "Status",
    className: "text-center justify-center",
    icone: (valor) => {
      const config = {
        Setup: { variant: "setup" },
        Parada: { variant: "parada" },
      };
      const estilo = config[valor] || { variant: "outline", className: "" };
      return (
        <Badge variant={estilo.variant} className={`whitespace-nowrap ${estilo.className}`}>
          {valor || "-"}
        </Badge>
      );
    },
  },
  {
    id: "data",
    key: "data",
    label: "Data (Inicio - Fim)",
    icone: (valor, row) => <DataEvento inicio={row.inicio} fim={row.fim} />,
  },
  {
    id: "duracao",
    key: "duracao",
    label: "Duracao",
    icone: (valor, row) => <DuracaoEvento inicio={row.inicio} fim={row.fim} />,
  },
  { id: "motivo", key: "motivo", label: "Motivo", className: "truncate max-w-[245px]" },
  { id: "observacao", key: "observacao", label: "Observacao", className: "truncate max-w-[200px]" },
];

const historicoEventosFilter = [
  { id: "tipo", label: "Tipo", type: "checkbox", options: ["Parada", "Setup"] },
  { id: "data", label: "Data", type: "date-range" },
];

const opcoesOrdenacao = [
  { label: "ID Crescente", value: "id_asc" },
  { label: "ID Decrescente", value: "id_desc" },
  { label: "Data Crescente", value: "data_asc" },
  { label: "Data Decrescente", value: "data_desc" },
];

export default function HistoricoEventosGestor() {
  const { eventos, loading, refresh } = useEventos();
  const { setorId } = usePerfil();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState([]);

  const eventosDoSetor = useMemo(() => {
    return (eventos || []).filter((evento) => !setorId || String(evento.setor_afetado) === String(setorId));
  }, [eventos, setorId]);

  useEffect(() => {
    setDados(eventosDoSetor);
  }, [eventosDoSetor]);

  const handleSort = (criterio) => {
    const ordenado = [...dados].sort((a, b) => {
      if (criterio === "id_asc") return Number(a.numero_evento) - Number(b.numero_evento);
      if (criterio === "id_desc") return Number(b.numero_evento) - Number(a.numero_evento);
      if (criterio === "data_asc") return new Date(a.inicio) - new Date(b.inicio);
      if (criterio === "data_desc") return new Date(b.inicio) - new Date(a.inicio);
      return 0;
    });
    setDados(ordenado);
  };

  const aplicarFiltros = (filtrosSelecionados) => {
    let filtrados = [...eventosDoSetor];

    if (filtrosSelecionados.tipo?.length > 0) {
      filtrados = filtrados.filter((evento) => filtrosSelecionados.tipo.includes(evento.tipo || evento.status));
    }

    if (filtrosSelecionados.data?.start) {
      filtrados = filtrados.filter((evento) => new Date(evento.inicio) >= new Date(filtrosSelecionados.data.start));
    }

    if (filtrosSelecionados.data?.end) {
      filtrados = filtrados.filter((evento) => new Date(evento.inicio) <= new Date(filtrosSelecionados.data.end));
    }

    setDados(filtrados);
  };

  const dadosExibidos = dados.filter((evento) => {
    const termo = busca.toLowerCase();
    return evento.nome?.toLowerCase().includes(termo) || String(evento.numero_evento).includes(termo) || String(evento.id).includes(termo);
  });

  const paradasJustificadas = useMemo(
    () => dadosExibidos.filter((evento) => evento.justificada === true),
    [dadosExibidos]
  );

  const paradasNaoJustificadas = useMemo(
    () => dadosExibidos.filter((evento) => evento.justificada === false),
    [dadosExibidos]
  );

  const modalJustificativa = (
    <DialogContent>
      <SolicitarJustificativaConteudo idsEventos={selecionados.map((row) => row.id)} onSucesso={refresh} />
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
      <SolicitarJustificativaMenuItem idEvento={row.id} onSucesso={refresh} />
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
    return <LoadingState message="Sincronizando eventos..." />;
  }

  return (
    <PageLayout>
      <PageHeader
        title="Histórico de Eventos"
        action={
          <Dialog>
            <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
              <Plus className="mr-2" />
              Registrar Evento
            </DialogTrigger>

            <DialogContent>
              <FormCadastroEventoGestor />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Gráficos  */}
      <ContentGrid cols={3} className="mt-2">
        <WidgetCard classname="h-120" colSpan="md:col-span-1">
          <ParadasComparadasWidget setorId={setorId} />
        </WidgetCard>
        <WidgetCard colSpan="md:col-span-2">
          <TopMotivosTempoWidget setorId={setorId} />
        </WidgetCard>
      </ContentGrid>

      {/* Listagem */}
      <SectionDivider title="Listagem de Eventos" className="mt-4" />


      <Tabs defaultValue="todos" className="w-full">
        <div className="flex items-center justify-between">
          <Label htmlFor="view-selector" className="sr-only">
            Visualizar
          </Label>
        </div>
        <Select defaultValue="todos">
          <SelectTrigger className="flex w-fit sm:hidden" size="sm" id="view-selector">
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


        {/* Telas maiores */}
        <div className="flex">
          <TabsList className="hidden sm:flex">
            <TabsTrigger value="todos" className="cursor-pointer">Todos</TabsTrigger>
            <TabsTrigger value="justificadas" className="cursor-pointer">Justificadas</TabsTrigger>
            <TabsTrigger value="nao-justificadas" className="cursor-pointer">Não Justificadas</TabsTrigger>
          </TabsList>
        </div>

        {/* Busca */}
        <SearchBar
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Busque por id do evento ou máquina..."
          className="mt-3"
        />

        {/* Linha de Quantidade e Ordenar e Filtrar */}
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

        {/* Tab todos */}
        <TabsContent value="todos" className="text-md">
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


        {/* Tab paradas justificadas */}
        <TabsContent value="justificadas" className="text-md">
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


        {/* Tab paradas não justificadas */}
        <TabsContent value="nao-justificadas" className="text-md">
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
