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
import Link from "next/link";

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
import FormJustificativaEvento from "@/components/ui/forms/historicoEventos/formJustificativaEvento";

const colunasEventos = [
  {
    id: 'evento',
    key: 'evento',
    label: 'Evento',
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

  { id: 'data', key: 'data', label: 'Data(Início - Fim)' },
  { id: 'duracao', key: 'duracao', label: 'Duração' },
  { id: 'motivo', key: 'motivo', label: 'Motivo' },
  { id: 'observacao', key: 'observacao', label: 'Observação', className: 'text-right' },
];

const dadosOriginais = [
  { evento: 'Setup', data: '26/03 (14:08 - Ativo)', duracao: '20:08', motivo: 'Motivo 1', justificada: true, observacao: 'Observação 1' },
  { evento: 'Parada', data: '26/03 (13:09 - 13:40)', duracao: '13:09', motivo: 'Aguardando Justificativa', justificada: false, observacao: 'Observação 2' },
  { evento: 'Setup', data: '26/03 (06:30 - 19:06)', duracao: '06:30', motivo: 'Troca de Molde', justificada: true, observacao: 'Observação 3' },
  { evento: 'Parada', data: '26/03 (14:10 - 14:45)', duracao: '00:35', motivo: 'Tal justificativa', justificada: true, observacao: 'Observação 4' },
  { evento: 'Setup', data: '26/03 (14:10 - 14:45)', duracao: '00:35', motivo: 'Limpeza', justificada: true, observacao: 'Observação 5' },
];

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
      <DialogTitle>
        Editar {selecionados.length === 1 ? 'evento' : 'eventos'}
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

  const opcoesOrdenacao = [
    { label: 'Ordem Alfabética', value: 'nome' },
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'eventos', value: 'eventos' }
  ];

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...historicoEventos];

    //filtro por evento
    if (filtrosSelecionados.evento && filtrosSelecionados.evento.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(maq =>
        filtrosSelecionados.evento.includes(maq.evento)
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
    { id: "evento", label: "evento", type: "checkbox", options: ["Parada", "Produzindo", "Setup"] },
    { id: "data", label: "Parada", type: "date-range" }
  ];



  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full pt-0 pb-10  px-8">

        <section>
          <div className="flex flex-wrap justify-between py-8">
            <div className="title_tela">
              <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
                Histórico de Eventos da Máquina
              </h1>
            </div>
            {/* Modal de Justificar Evento */}
            <div className="modal_justificativa">
              <Dialog>
                <DialogTrigger className="bg-secondary-foreground px-5 py-2 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                  <Pencil className="mr-2" />
                  Justificar
                </DialogTrigger>
                <DialogContent>
                  <FormJustificativaEvento />
                </DialogContent>
              </Dialog>

            </div>
          </div>
        </section>

        <section>
          {/* Busca */}
          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none bg-transparent"
                placeholder="Busque por nome ou id..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <button className="outline-none cursor-pointer mr-2"><Search /></button>
            </div>
          </div>

          <div className="row_ord_fil_cont flex items-center justify-between mt-3">
            <p>{dadosExibidos.length} eventos encontrados</p>

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

          <div className="flex flex-col flex-1 items-center w-full mt-4">
            {dadosExibidos.length > 0 ? (

              <TableListagens
                /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
                data={dadosExibidos} columns={colunasEventos}
              />
            ) : (
              //caso não encontre nada correspondente
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhum evento encontrado</h2>
                <p>Não encontramos nenhum evento "{busca}".</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}

function EmptyState({ busca }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500">
      <Search className="w-12 h-12 mb-4 text-gray-300" />
      <h2 className="text-xl font-semibold">Nenhum evento encontrado</h2>
      <p>Não encontramos nenhum evento "{busca}".</p>
    </div>
  );
}