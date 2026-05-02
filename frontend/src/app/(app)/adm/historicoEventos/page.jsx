"use client"

import { ParadasComparadasWidget } from "@/features/eventos/ParadasComparadasWidget";
import { TopMotivosTempoWidget } from "@/features/eventos/TopMotivosTempoWidget";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";

import { Plus, Search, Upload, File, Pencil, Trash2, Clock4, EyeIcon, BellRing } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

//imports da listagem
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import FilterDropdown from "@/components/ui/filterDropdown";
import OrdenarDropdown from "@/components/ui/ordenarDropdown";

const colunasEventos = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' }, /* id da máquina */
  { id: 'maquina', key: 'maquina', label: 'Máquina' },
  {
    id: 'tipo',
    key: 'tipo',
    label: 'Tipo',
    className: 'text-center justify-center',
    icone: (valor) => {
      const config = {
        "Setup": {
          variant: "secondary",
          className: "bg-[#fffbea] text-amarelo font-semibold text-sm "
        },
        "Parada": {
          variant: "destructive",
          className: "font-semibold text-sm border-none"
        }
      };

      const estilo = config[valor] || { variant: "outline", className: "" };
      return (
        <Badge variant={estilo.variant} className={`whitespace-nowrap ${estilo.className}`}>
          {valor}
        </Badge>
      );
    }
  },
  { id: 'data', key: 'data', label: 'Data' },
  { id: 'duracao', key: 'duracao', label: 'Duração' },
  { id: 'motivo', key: 'motivo', label: 'Motivo' },
];

const dadosOriginais = [
  { id: 1, maquina: 'Máquina A', tipo: 'Setup', data: '26/03 (14:08 - Ativo)', duracao: '20:08', motivo: 'Motivo 1', justificada: true },
  { id: 2, maquina: 'Máquina B', tipo: 'Parada', data: '26/03 (13:09 - 13:40)', duracao: '13:09', motivo: 'Aguardando Justificativa', justificada: false },
  { id: 3, maquina: 'Máquina C', tipo: 'Setup', data: '26/03 (06:30 - 19:06)', duracao: '06:30', motivo: 'Troca de Molde', justificada: true },
  { id: 4, maquina: 'Máquina D', tipo: 'Parada', data: '26/03 (14:10 - 14:45)', duracao: '00:35', motivo: 'Tal justificativa', justificada: true },
  { id: 5, maquina: 'Máquina E', tipo: 'Setup', data: '26/03 (14:10 - 14:45)', duracao: '00:35', motivo: 'Limpeza', justificada: true },
];

const acoesDropdown = (row) => (
  <>
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
          <BellRing className="mr-2 h-4 w-4" />
          Solicitar Justificativa
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent />
    </Dialog>

    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4 text-primary" />
          Editar Evento
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent />
    </Dialog>
  </>
);


export default function HistoricoEventos() {
  const [dados, setDados] = useState(dadosOriginais);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState([]);

  const handleEdit = (rows) => {
    console.log("Editar:", rows);
  };

  const handleJustificativa = (rows) => {
    console.log("Solicitar justificativa:", rows);
  };

  const modalEditar = (
    <DialogContent>
      <DialogTitle>Editar Evento</DialogTitle>
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
      if (criterio === 'nome') return a.nome.localeCompare(b.nome);
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'turno') return a.turno.localeCompare(b.turno);
      if (criterio === 'funcao') return a.funcao.localeCompare(b.funcao);
      if (criterio === 'eventos') return a.eventos.localeCompare(b.eventos);
      return 0;
    });

    setDados(dadosCopiados);
  };

  const dadosExibidos = dados.filter((eventos) => {
    const termo = busca.toLowerCase();
    return (
      eventos.motivo.toLowerCase().includes(termo) ||
      eventos.gestor.toString().includes(termo)
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

  const opcoesOrdenacao = [
    { label: 'Ordem Alfabética', value: 'nome' },
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'eventos', value: 'eventos' }
  ];

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...historicoEventos];

    //filtro por status
    if (filtrosSelecionados.status && filtrosSelecionados.status.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(maq =>
        filtrosSelecionados.status.includes(maq.status)
      );
    }

    if (filtrosSelecionados.eventos && filtrosSelecionados.eventos.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(maq =>
        filtrosSelecionados.eventos.includes(maq.eventos)
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

  const historicoEventosFilter = [
    { id: "eventos", label: "eventos", type: "checkbox", options: ["Roscas", "Engrenagens"] },
    { id: "status", label: "Status", type: "checkbox", options: ["Parada", "Produzindo", "Setup"] },
    { id: "data", label: "Parada", type: "date-range" }
  ];



  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">

      <div className="w-full mt-8 pt-0 pb-10 space-y-4 px-8">
        {/* TÍTULO E BOTÃO */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex justify-start">
            <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
              Histórico de Eventos
            </h1>
          </div>

          {/* Modal de Registro de Evento */}
          <div className="modal_cadastro">
            <Dialog>
              <DialogTrigger className="bg-secondary-foreground py-1 rounded-md flex items-center text-white text-xl font-semibold">
                <Plus className="mr-2" />
                Registrar Evento
              </DialogTrigger>
              <DialogContent>
                <h1>registrando evento</h1>
              </DialogContent>

            </Dialog>
          </div>
        </div>

        {/* SEÇÃO DOS GRÁFICOS  */}
        <section className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Widget 1/3 */}
            <div className="bg-white border rounded-xl p-4 md:col-span-1">
              <ParadasComparadasWidget />
            </div>

            {/* Widget 2/3 */}
            <div className="bg-white border rounded-xl p-4 md:col-span-2">
              <TopMotivosTempoWidget />
            </div>

          </div>
        </section>

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

          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none bg-transparent"
                placeholder="Busque por nome ou gestor..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <button className="outline-none cursor-pointer mr-2">
                <Search />
              </button>
            </div>
          </div>

          <div className="row_ord_fil_cont flex items-center justify-between mt-2">
            <p>{dadosExibidos.length} máquinas encontradas</p>

            <div className="flex items-center gap-4">
              <OrdenarDropdown
                label="Ordenar por"
                options={opcoesOrdenacao}
                onSortChange={handleSort}
              />

              <FilterDropdown
                filtersConfig={historicoEventosFilter}
                onApply={aplicarFiltros}
              />
            </div>
          </div>

          {/* Tab todos */}
          <TabsContent value="todos">
            {dadosExibidos.length > 0 ? (
              <TableListagens
                data={dadosExibidos}
                columns={colunasEventos}
                enableSelection={true}
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
                editarLote={modalEditar}
                solicitarJustificativa={modalJustificativa}
              />
            ) : (
              <EmptyState busca="" />
            )}
          </TabsContent>

          {/* Tab paradas justificadas */}
          <TabsContent value="justificadas" className="px-8">
            {paradasJustificadas.length > 0 ? (
              <TableListagens
                data={dadosExibidos}
                columns={colunasEventos}
                enableSelection={true}
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
                editarLote={modalEditar}
                solicitarJustificativa={modalJustificativa}
              />
            ) : (
              <EmptyState busca="Paradas Justificadas" />
            )}
          </TabsContent>

          {/* Tab paradas não justificadas */}
          <TabsContent value="nao-justificadas">
            {paradasNaoJustificadas.length > 0 ? (
              <TableListagens
                data={dadosExibidos}
                columns={colunasEventos}
                enableSelection={true}
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
                editarLote={modalEditar}
                solicitarJustificativa={modalJustificativa}
              />
            ) : (
              <EmptyState busca="Paradas Não Justificadas" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function EmptyState({ busca }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500">
      <Search className="w-12 h-12 mb-4 text-gray-300" />
      <h2 className="text-xl font-semibold">Nenhuma máquina encontrada</h2>
      <p>Não encontramos nenhuma máquina "{busca}".</p>
    </div>
  );
}