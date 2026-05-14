"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, EyeIcon, Loader2, Pencil, Plus, Search } from "lucide-react";

import { ParadasComparadasWidget } from "@/features/eventos/ParadasComparadasWidget";
import { TopMotivosTempoWidget } from "@/features/eventos/TopMotivosTempoWidget";
import { useEventos } from "@/hooks/useEventos";
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
import ModalSucessNotificacao from "@/components/ui/forms/historicoEventos/modalSucessNotificacao";
import FormCadastroEventoGestor from "@/components/ui/forms/historicoEventos/formCadastroEventoGestor";

const colunasEventos = [
  { id: "id", key: "id", label: "ID", className: "w-25 text-center justify-center" },
  { id: "nome", key: "nome", label: "Nome" },
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
  { id: "motivo", key: "motivo", label: "Motivo" },
  { id: "observacao", key: "observacao", label: "Observacao" },
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

function getSetorIdFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.id_setor ?? payload?.idSetor ?? null;
  } catch {
    return null;
  }
}

export default function HistoricoEventosGestor() {
  const { eventos, loading, refresh } = useEventos();
  const [setorId, setSetorId] = useState(null);
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState([]);

  useEffect(() => {
    setSetorId(getSetorIdFromToken());
  }, []);

  const eventosDoSetor = useMemo(() => {
    return (eventos || []).filter((evento) => !setorId || String(evento.setor_afetado) === String(setorId));
  }, [eventos, setorId]);

  useEffect(() => {
    setDados(eventosDoSetor);
  }, [eventosDoSetor]);

  const handleSort = (criterio) => {
    const ordenado = [...dados].sort((a, b) => {
      if (criterio === "id_asc") return Number(a.id) - Number(b.id);
      if (criterio === "id_desc") return Number(b.id) - Number(a.id);
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
    return evento.nome?.toLowerCase().includes(termo) || String(evento.id).includes(termo);
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
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-900 w-12 h-12" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="px-8">
        <div className="py-4">
          <div className="flex justify-between items-center">
            <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
              Historico de Eventos
            </h1>
            <Dialog>
              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                <Plus className="mr-2" />
                Registrar Evento
              </DialogTrigger>
              <DialogContent>
                <FormCadastroEventoGestor onCadastroSucesso={refresh} />
              </DialogContent>
            </Dialog>
          </div>

          <section className="py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border rounded-xl p-4 md:col-span-1">
                <ParadasComparadasWidget setorId={setorId} />
              </div>
              <div className="bg-white border rounded-xl p-4 md:col-span-2">
                <TopMotivosTempoWidget setorId={setorId} />
              </div>
            </div>
          </section>
        </div>

        <section id="listagem_eventos">
          <div className="flex items-center gap-5 mb-4">
            <h2 className="text-4xl font-semibold">Listagem de Eventos</h2>
            <hr className="bg-black flex-1 h-1" />
          </div>

          <Tabs defaultValue="todos" className="w-full">
            <div className="flex items-center justify-between">
              <Label htmlFor="view-selector" className="sr-only">Visualizar</Label>
            </div>
            <Select defaultValue="todos">
              <SelectTrigger className="flex w-fit sm:hidden" size="sm" id="view-selector">
                <SelectValue placeholder="Selecione o filtro" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="justificadas">Justificadas</SelectItem>
                  <SelectItem value="nao-justificadas">Nao Justificadas</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex">
              <TabsList className="hidden sm:flex">
                <TabsTrigger value="todos" className="cursor-pointer">Todos</TabsTrigger>
                <TabsTrigger value="justificadas" className="cursor-pointer">Justificadas</TabsTrigger>
                <TabsTrigger value="nao-justificadas" className="cursor-pointer">Nao Justificadas</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex searchbar">
              <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
                <input
                  type="search"
                  className="p-2 w-full outline-none bg-transparent"
                  placeholder="Busque por id do evento ou maquina..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
                <button className="outline-none cursor-pointer mr-2"><Search /></button>
              </div>
            </div>

            <div className="row_ord_fil_cont flex items-center justify-between mt-2">
              <p>{dadosExibidos.length} eventos encontrados</p>
              <div className="flex items-center gap-4">
                <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacao} onSortChange={handleSort} />
                <FilterDropdown filtersConfig={historicoEventosFilter} onApply={aplicarFiltros} />
              </div>
            </div>

            <TabsContent value="todos" className="text-md">
              <TableListagens
                data={dadosExibidos}
                columns={colunasEventos}
                enableSelection
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
                solicitarJustificativa={modalJustificativa}
              />
            </TabsContent>

            <TabsContent value="justificadas" className="text-md">
              <TableListagens
                data={paradasJustificadas}
                columns={colunasEventos}
                enableSelection
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
                solicitarJustificativa={modalJustificativa}
              />
            </TabsContent>

            <TabsContent value="nao-justificadas" className="text-md">
              <TableListagens
                data={paradasNaoJustificadas}
                columns={colunasEventos}
                enableSelection
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
                solicitarJustificativa={modalJustificativa}
              />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
