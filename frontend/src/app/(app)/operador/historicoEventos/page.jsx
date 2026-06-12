"use client";

import { ParadasComparadasWidget } from "@/features/eventos/ParadasComparadasWidget";
import { TopMotivosTempoWidget } from "@/features/eventos/TopMotivosTempoWidget";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Plus,
  Search,
  Upload,
  File,
  Pencil,
  Trash2,
  Clock4,
  EyeIcon,
  BellRing,
  Info,
  Loader2,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useEventos } from "@/hooks/useEventos";

//imports da listagem
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
import { Textarea } from "@/components/ui/textarea";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FormJustificativaEvento from "@/components/ui/forms/historicoEventos/formJustificativaEvento";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";
import { DataEvento } from "@/components/ui/dataEvento";
import {
  filtrarPorDataInicio,
  filtrarPorDuracaoMax,
  duracaoEmMinutos,
} from "@/lib/filterUtils";

import DetalhaeEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEventoOperador";

import {
  PageLayout,
  PageHeader,
  PageSection,
  SearchBar,
  FilterRow,
  EmptyState,
  LoadingState,
} from "@/components/AnimatedComponents";

const colunasEventos = [
  {
    id: "evento",
    key: "tipo",
    label: "Evento",
    className: "text-center justify-center",
    icone: (valor) => {
      const config = {
        Setup: { variant: "setup" },
        Parada: { variant: "parada" },
      };

      const estilo = config[valor] || { variant: "outline", className: "" };
      return (
        <Badge
          variant={estilo.variant}
          className={`whitespace-nowrap ${estilo.className}`}
        >
          {valor}
        </Badge>
      );
    },
  },

  {
    id: "data",
    key: "data",
    label: "Data (Início - Fim)",
    className: "pl-20 w-1/5",
    icone: (valor, row) => <DataEvento inicio={row.inicio} fim={row.fim} />,
  },
  {
    id: "duracao",
    key: "duracao",
    label: "Duração",
    icone: (valor, row) => <DuracaoEvento inicio={row.inicio} fim={row.fim} />,
  },
  { id: "motivo", key: "motivo", label: "Motivo" },
  {
    id: "observacao",
    key: "observacao",
    label: "Observação",
    className: "pl-5",
  },
];

export default function HistoricoEventos() {
  const { eventos, loading, error, refresh } = useEventos();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState([]);
  const [justificativaAberta, setJustificativaAberta] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("justificar") === "1") {
      setJustificativaAberta(true);
    }
  }, []);

  //sincronizar dados da API com estado local
  useEffect(() => {
    setDados(eventos);
  }, [eventos]);

  const handleEdit = (rows) => {
    console.log("Editar:", rows);
  };

  const handleJustificativa = (rows) => {
    console.log("Solicitar justificativa:", rows);
  };

  const modalEditar = (
    <DialogContent>
      <DialogTitle>
        Editar {selecionados.length === 1 ? "evento" : "eventos"}
      </DialogTitle>
    </DialogContent>
  );

  const modalJustificativa = (
    <DialogContent>
      <DialogTitle>Solicitar Justificativa</DialogTitle>
    </DialogContent>
  );

  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      if (criterio === "data_asc")
        return new Date(a.inicio) - new Date(b.inicio);
      if (criterio === "data_desc")
        return new Date(b.inicio) - new Date(a.inicio);
      if (criterio === "duracao_asc")
        return duracaoEmMinutos(a) - duracaoEmMinutos(b);
      if (criterio === "duracao_desc")
        return duracaoEmMinutos(b) - duracaoEmMinutos(a);
      return 0;
    });

    setDados(dadosCopiados);
  };

  const dadosExibidos = dados.filter((evento) => {
    const termo = busca.toLowerCase();
    return (
      evento.tipo?.toLowerCase().includes(termo) ||
      evento.id?.toString().includes(termo) ||
      evento.motivo?.toLowerCase().includes(termo)
    );
  });

  const opcoesOrdenacao = [
    { label: "Data Crescente", value: "data_asc" },
    { label: "Data Decrescente", value: "data_desc" },
    { label: "Duração Crescente", value: "duracao_asc" },
    { label: "Duração Decrescente", value: "duracao_desc" },
  ];

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...eventos];

    if (filtrosSelecionados.tipo?.length > 0) {
      dadosFiltrados = dadosFiltrados.filter((item) =>
        filtrosSelecionados.tipo.includes(item.tipo),
      );
    }

    dadosFiltrados = filtrarPorDataInicio(
      dadosFiltrados,
      filtrosSelecionados.data,
    );

    if (filtrosSelecionados.duracao?.max) {
      dadosFiltrados = filtrarPorDuracaoMax(
        dadosFiltrados,
        filtrosSelecionados.duracao.max,
      );
    }

    setDados(dadosFiltrados);
  };

  const historicoEventosFilter = [
    {
      id: "tipo",
      label: "Tipo de Evento",
      type: "checkbox",
      options: ["Parada", "Setup"],
    },
    { id: "data", label: "Data", type: "date-range" },
    { id: "duracao", label: "Duração máx.", type: "time-max" },
  ];

  //tela de carregamento enquanto busca os dados da API
  if (loading) {
    return <LoadingState message="Sincronizando eventos..." />;
  }

  return (
    <PageLayout>
      <PageHeader
        title="Histórico de Eventos da Máquina"
        action={
          <Dialog
            open={justificativaAberta}
            onOpenChange={setJustificativaAberta}
          >
            <DialogTrigger
              onClick={() => setJustificativaAberta(true)}
              className="bg-secondary-foreground px-5 py-2 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer"
            >
              <Pencil className="mr-2" />
              Justificar
            </DialogTrigger>
            <DialogContent>
              <FormJustificativaEvento
                onFechar={() => {
                  setJustificativaAberta(false);
                  refresh();
                }}
              />
            </DialogContent>
          </Dialog>
        }
      />

      <PageSection>
        <SearchBar
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Busque por tipo de evento..."
        />

        <FilterRow
          count={dadosExibidos.length}
          className="mb-6"
          label="eventos"
          actions={
            <>
              <OrdenarDropdown
                label="Ordenar por"
                options={opcoesOrdenacao}
                onSortChange={handleSort}
              />
              <FilterDropdown
                filtersConfig={historicoEventosFilter}
                onApply={aplicarFiltros}
              />
            </>
          }
        />

        {dadosExibidos.length > 0 ? (
          <TableListagens
          className="mt-4"
            data={dadosExibidos}
            columns={colunasEventos}
            acoesDropdown={(maquina) => (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer"
                    >
                      <EyeIcon
                        strokeWidth={2}
                        className="mr-1 h-4 w-4 text-primary"
                      />
                      Ver Detalhes
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DetalhaeEvento />
                  </DialogContent>
                </Dialog>
              </>
            )}
          />
        ) : (
          //caso não encontre nada correspondente
          <EmptyState
            title="Nenhum evento encontrado"
            message="Não encontramos nenhum evento com esse termo ou filtro."
          />
        )}
      </PageSection>
    </PageLayout>
  );
}
