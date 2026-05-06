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


import { Plus, Search, Pencil, Clock4, EyeIcon, BellRing, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

import { useEventos } from "@/hooks/useEventos";

//imports da listagem
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";

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


import FilterDropdown from "@/components/ui/filterDropdown";
import OrdenarDropdown from "@/components/ui/ordenarDropdown";
import DetalhaeEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEvento";
import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
import FormEdicaoEvento from "@/components/ui/forms/historicoEventos/formEdicaoEvento";
import ModalSucessNotificacao from "@/components/ui/forms/historicoEventos/modalSucessNotificacao";

const colunasEventos = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' },
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
          className: "bg-[#fffbea] text-amarelo font-semibold text-sm"
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
  { id: 'data', key: 'data', label: 'Data (Início - Fim)' },
  { id: 'duracao', key: 'duracao', label: 'Duração' },
  { id: 'motivo', key: 'motivo', label: 'Motivo' },
  { id: 'observacao', key: 'observacao', label: 'Observação' },
];

const historicoEventosFilter = [
  { id: "tipo", label: "Tipo", type: "checkbox", options: ["Parada", "Setup"] },
  { id: "data", label: "Data", type: "date-range" },
  // {id:"duracao", label:"Duração", type:"time-max"} --> não funcionou, tentei de várias formas mas o filtro por duração não funcionou, então deixei comentado por enquanto. quem quiser tentar implementar depois, fique à vontade!
];


const opcoesOrdenacao = [
  { label: 'ID Crescente', value: 'id_asc' },
  { label: 'ID Decrescente', value: 'id_desc' },
  { label: 'Data Crescente', value: 'data_asc' },
  { label: 'Data Decrescente', value: 'data_desc' },
  { label: 'Duração Crescente', value: 'duracao_asc' },
  { label: 'Duração Decrescente', value: 'duracao_desc' }
];

export default function HistoricoEventos() {
  const { eventos, loading, error, refresh } = useEventos();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState([]);


  //sincronizar dados da API com estado local
  useEffect(() => {
    setDados(eventos);
  }, [eventos]);

  const handleSort = (criterio) => {
    const dadosCopiados = [...dados];


    dadosCopiados.sort((a, b) => {
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'maquina') return a.maquina.localeCompare(b.maquina);
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


  const aplicarFiltros = (filtrosSelecionados) => {
    let dadosFiltrados = [...eventos]; // usa o estado da API

    //filtro por tipo
    if (filtrosSelecionados.tipo && filtrosSelecionados.tipo.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(evento =>
        filtrosSelecionados.tipo.includes(evento.tipo)
      );
    }

    //filtro por data
    if (filtrosSelecionados.data) {
      if (filtrosSelecionados.data.start) {
        dadosFiltrados = dadosFiltrados.filter(evento =>
          new Date(evento.inicio) >= new Date(filtrosSelecionados.data.start)
        );
      }
      if (filtrosSelecionados.data.end) {
        dadosFiltrados = dadosFiltrados.filter(evento =>
          new Date(evento.inicio) <= new Date(filtrosSelecionados.data.end)
        );
      }
    }

    // //filtro por duração --> não funcionou
    //  if (filtrosSelecionados.duracao) {
    //   const duracaoMax = filtrosSelecionados.duracao;
    //   dadosFiltrados = dadosFiltrados.filter(evento => {    
    //     const [horas, minutos] = evento.duracao.split(':').map(Number);
    //     const duracaoEvento = horas * 60 + minutos;
    //     return duracaoEvento <= duracaoMax;
    //   });
    // }

    setDados(dadosFiltrados);
  };

  //filtra os dados atuais (filtrados e ordenados) pelo termo de busca
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

  // ações do dropdown da tabela
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
          <DetalhaeEvento />
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
              <DialogTrigger className="bg-secondary-foreground py-1.5 px-5 rounded-md flex items-center text-white text-xl font-semibold">
                <Plus className="mr-2" />
                Registrar Evento
              </DialogTrigger>
              <DialogContent>
                <FormCadastroEvento onCadastroSucesso={refresh} />
              </DialogContent>
            </Dialog>
          </div>
        </div>


        {/* SEÇÃO DOS GRÁFICOS */}
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


        {/* Listagem */}
        <div className="flex items-center gap-5">
          <h1 className="text-4xl w-[125] font-semibold">Listagem de Eventos</h1>
          <hr className="bg-black flex-1 h-1" />
        </div>
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
                placeholder="Busque por id do evento ou máquina..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <button className="outline-none cursor-pointer mr-2">
                <Search />
              </button>
            </div>
          </div>


          <div className="row_ord_fil_cont flex items-center justify-between mt-2">
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


          {/* Tab todos */}
          <TabsContent value="todos" className="text-md">
            {dadosExibidos.length > 0 ? (
              <TableListagens
                data={dadosExibidos}
                columns={colunasEventos}
                enableSelection={true}
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
                solicitarJustificativa={modalJustificativa}
              />
            ) : (
              <EmptyState busca={busca} />
            )}
          </TabsContent>


          {/* Tab paradas justificadas */}
          <TabsContent value="justificadas">
            {paradasJustificadas.length > 0 ? (
              <TableListagens
                data={paradasJustificadas}
                columns={colunasEventos}
                enableSelection={true}
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
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
                data={paradasNaoJustificadas}
                columns={colunasEventos}
                enableSelection={true}
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
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
      <h2 className="text-xl font-semibold">Nenhum evento encontrado</h2>
      <p>Não encontramos nenhum resultado para "{busca}".</p>
    </div>
  );
}

