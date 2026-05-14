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

import { Plus, Search, Upload, File, Pencil, Trash2, Clock4, EyeIcon, BellRing, Info, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useEventos } from "@/hooks/useEventos";

//imports da listagem
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"


import {
  DropdownMenuItem,
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

import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FormJustificativaEvento from "@/components/ui/forms/historicoEventos/formJustificativaEvento";

import DetalhaeEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEventoOperador";

const colunasEventos = [
  {
    id: 'evento',
    key: 'tipo',
    label: 'Evento',
    className: 'text-center justify-center',
    icone: (valor) => {
      const config = {
        "Setup": {
          variant: "secondary",
          className: "bg-[var(--status-warning-bg)] text-amarelo font-semibold text-sm "
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

  { id: 'data', key: 'data', label: 'Data(Início - Fim)', className: 'pl-20 w-1/5' },
  { id: 'duracao', key: 'duracao', label: 'Duração' },
  { id: 'motivo', key: 'motivo', label: 'Motivo' },
  { id: 'observacao', key: 'observacao', label: 'Observação', className: 'pl-5' },
];

export default function HistoricoEventos() {
  const { eventos, loading, error, refresh } = useEventos();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState([]);
  const [justificativaAberta, setJustificativaAberta] = useState(false);

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
      if (criterio === 'data_asc') return new Date(a.inicio) - new Date(b.inicio);
      if (criterio === 'data_desc') return new Date(b.inicio) - new Date(a.inicio);
      if (criterio === 'duracao_asc') {
        const [horasA, minutosA] = a.duracao.split(':').map(Number);
        const [horasB, minutosB] = b.duracao.split(':').map(Number);
        return (horasA * 60 + minutosA) - (horasB * 60 + minutosB);
      }
      if (criterio === 'duracao_desc') {
        const [horasA, minutosA] = a.duracao.split(':').map(Number);
        const [horasB, minutosB] = b.duracao.split(':').map(Number);
        return (horasB * 60 + minutosB) - (horasA * 60 + minutosA);
      }

      return 0;
    });

    setDados(dadosCopiados);
  };

  const dadosExibidos = dados.filter((eventos) => {
    const termo = busca.toLowerCase();
    return (
      eventos.tipo.toLowerCase().includes(termo) // ← só filtra por tipo
    );
  });

  const opcoesOrdenacao = [
    { label: 'Data Crescente', value: 'data_asc' },
    { label: 'Data Decrescente', value: 'data_desc' },
    { label: 'Duração Crescente', value: 'duracao_asc' },
    { label: 'Duração Decrescente', value: 'duracao_desc' }
  ];

  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...eventos];

    //filtro por tipo
    if (filtrosSelecionados.tipo && filtrosSelecionados.tipo.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(item =>
        filtrosSelecionados.tipo.includes(item.tipo)
      );
    }

    //filtro por data
    if (filtrosSelecionados.data) {
      if (filtrosSelecionados.data.start) {
        const dataInicio = new Date(filtrosSelecionados.data.start);
        dadosFiltrados = dadosFiltrados.filter(item =>
          new Date(item.inicio ?? item.data) >= dataInicio
        );
      }
      if (filtrosSelecionados.data.end) {
        const dataFim = new Date(filtrosSelecionados.data.end);
        dadosFiltrados = dadosFiltrados.filter(item =>
          new Date(item.inicio ?? item.data) <= dataFim
        );
      }
    }

    setDados(dadosFiltrados);
  }

  const historicoEventosFilter = [
    { id: "tipo", label: "Tipo de Evento", type: "checkbox", options: ["Parada", "Setup"] },
    { id: "data", label: "Data", type: "date-range" },
    // {id:"duracao", label:"Duração", type: "time-max"}  --> não funcionou, tentei de várias formas mas o filtro por duração não funcionou, então deixei comentado por enquanto. quem quiser tentar implementar depois, fique à vontade!
  ];


  //tela de carregamento enquanto busca os dados da API
  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-900 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Carregando eventos...</p>
        </div>
      </main>
    );
  }

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
              <Dialog open={justificativaAberta} onOpenChange={setJustificativaAberta}>
                <DialogTrigger
                  onClick={() => setJustificativaAberta(true)}
                  className="bg-secondary-foreground px-5 py-2 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer"
                >
                  <Pencil className="mr-2" />
                  Justificar
                </DialogTrigger>
                <DialogContent>
                  <FormJustificativaEvento onFechar={() => {
                    setJustificativaAberta(false);
                    refresh();
                  }} />
                </DialogContent>
              </Dialog>

            </div>
          </div>
        </section>

        <section>
          {/* Busca */}
          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[var(--cinza-claro)]">
              <input
                type="search"
                className="p-2 w-full outline-none font-medium bg-transparent"
                placeholder="Busque por tipo de evento..."
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
                data={dadosExibidos} columns={colunasEventos}
                acoesDropdown={(maquina) => (
                  <>

                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <EyeIcon strokeWidth={2} className="mr-1 h-4 w-4 text-primary" />
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
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-500">Nenhum evento encontrado</h2>
                <p>Não encontramos nenhum evento com esse termo ou filtro.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
