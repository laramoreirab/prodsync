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

import { Plus, Search, Pencil, EyeIcon, BellRing, Loader2 } from "lucide-react";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";
import { DataEvento } from "@/components/ui/dataEvento";

import { useState, useMemo, useEffect } from "react";

import { useEventos } from "@/hooks/useEventos";

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


import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEventoGestor";
import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
import FormEdicaoEvento from "@/components/ui/forms/historicoEventos/formEdicaoEvento";
import ModalSucessNotificacao from "@/components/ui/forms/historicoEventos/modalSucessNotificacao";
import FormCadastroEventoGestor from "@/components/ui/forms/historicoEventos/formCadastroEventoGestor";


const colunasEventos = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-25 text-center justify-center' },
  { id: 'nome', key: 'nome', label: 'Nome' }, /* nome da máquina */
  {
    id: 'status', key: 'status', label: 'Status', className: 'text-center justify-center',
    icone: (valor) => {
      const config = {
        "Setup": { variant: "setup", },
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
    id: 'data',
    key: 'data',
    label: 'Data (Início - Fim)',
    icone: (valor, row) => (
      <DataEvento inicio={row.inicio} fim={row.fim} />
    )
  },
  {
    id: 'duracao', key: 'duracao', label: 'Duração',
    icone: (valor, row) => (
      <DuracaoEvento inicio={row.inicio} fim={row.fim} />
    )
  },
  { id: 'motivo', key: 'motivo', label: 'Motivo' },
  { id: 'observacao', key: 'observacao', label: 'Observação' },
];

const dadosEventos = [
  {
    id: 501,
    nome: "Injetora HAITIAN 120",
    status: "Parada",
    inicio: "2026-05-11T08:00:00",
    fim: "2026-05-11T08:45:00",
    motivo: "Manutenção Corretiva",
    observacao: "Troca de mangueira hidráulica com vazamento."
  },
  {
    id: 502,
    nome: "Torno CNC Nardini",
    status: "Setup",
    inicio: "2026-05-11T09:15:00",
    fim: "2026-05-11T10:30:00",
    motivo: "Troca de Ferramental",
    observacao: "Preparação para nova ordem de serviço (OP-44)."
  },
  {
    id: 503,
    nome: "Prensa Hidráulica 50T",
    status: "Parada",
    inicio: "2026-05-11T10:00:00",
    fim: "2026-05-11T10:15:00",
    motivo: "Falta de Material",
    observacao: "Aguardando abastecimento de chapas de aço."
  },
  {
    id: 504,
    nome: "Corte a Laser Fiber",
    status: "Setup",
    inicio: "2026-05-11T11:00:00",
    fim: "2026-05-11T11:20:00",
    motivo: "Ajuste de Parâmetros",
    observacao: "Calibração do foco para espessura de 10mm."
  },
  {
    id: 505,
    nome: "Solda Robotizada Kuka",
    status: "Parada",
    inicio: "2026-05-11T13:00:00",
    fim: "2026-05-11T13:40:00",
    motivo: "Erro de Software",
    observacao: "Reinicialização do sistema de controle do braço."
  },
  {
    id: 506,
    nome: "Dobradeira CNC",
    status: "Setup",
    inicio: "2026-05-11T14:00:00",
    fim: "2026-05-11T14:45:00",
    motivo: "Troca de Matriz",
    observacao: "Substituição de ferramentas para dobra em V."
  },
  {
    id: 507,
    nome: "Extrusora de Perfil",
    status: "Parada",
    inicio: "2026-05-11T15:00:00",
    fim: "2026-05-11T16:30:00",
    motivo: "Limpeza de Cabeçote",
    observacao: "Resíduo de material carbonizado detectado."
  },
  {
    id: 508,
    nome: "Retífica Plana",
    status: "Parada",
    inicio: "2026-05-11T16:00:00",
    fim: "2026-05-11T16:10:00",
    motivo: "Inspeção de Qualidade",
    observacao: "Verificação dimensional da primeira peça."
  },
  {
    id: 509,
    nome: "Torno Automático A25",
    status: "Setup",
    inicio: "2026-05-11T07:30:00",
    fim: "2026-05-11T09:00:00",
    motivo: "Abastecimento de Barra",
    observacao: "Carga de novo lote de tarugos de alumínio."
  },
  {
    id: 510,
    nome: "Centro de Usinagem VMC",
    status: "Parada",
    inicio: "2026-05-11T11:20:00",
    fim: "2026-05-11T11:55:00",
    motivo: "Quebra de Broca",
    observacao: "Substituição e reset de coordenadas."
  },
  {
    id: 511,
    nome: "Fresadora Universal",
    status: "Setup",
    inicio: "2026-05-11T13:30:00",
    fim: "2026-05-11T14:15:00",
    motivo: "Ajuste de Fixação",
    observacao: "Instalação de morsa hidráulica de precisão."
  },
  {
    id: 512,
    nome: "Forno de Têmpera",
    status: "Parada",
    inicio: "2026-05-11T02:00:00",
    fim: "2026-05-11T06:00:00",
    motivo: "Resfriamento Programado",
    observacao: "Ciclo de descanso obrigatório do refratário."
  },
  {
    id: 513,
    nome: "Envasadora Automática",
    status: "Setup",
    inicio: "2026-05-11T10:00:00",
    fim: "2026-05-11T10:45:00",
    motivo: "Troca de Produto",
    observacao: "Sanitização para troca de envase (Lote A para B)."
  },
  {
    id: 514,
    nome: "Ponte Rolante 10T",
    status: "Parada",
    inicio: "2026-05-11T08:30:00",
    fim: "2026-05-11T09:00:00",
    motivo: "Checklist Diário",
    observacao: "Inspeção de cabos e freios de segurança."
  },
  {
    id: 515,
    nome: "Injetora HAITIAN 120",
    status: "Setup",
    inicio: "2026-05-11T17:00:00",
    fim: "2026-05-11T18:30:00",
    motivo: "Troca de Molde",
    observacao: "Instalação do molde de tampa de 20mm."
  }
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
  // { label: 'Duração Crescente', value: 'duracao_asc' }, --> filtro por duração não funcionou
  // { label: 'Duração Decrescente', value: 'duracao_desc' }
];


export default function HistoricoEventosGestor() {
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    setDados(dadosEventos);
  }, []);

  const handleSort = (criterio) => {
    const dadosCopiados = [...dadosEventos];


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
    let dadosFiltrados = [...dadosEventos]; 

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
      evento.nome.toLowerCase().includes(termo) ||
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

  const [selecionados, setSelecionados] = useState([]);

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
          <FormEdicaoEvento />
        </DialogContent>
      </Dialog>

    </>
  );

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="px-8">

        <div className="py-4">
          <div className="flex justify-between items-center">
            <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
              Histórico de Eventos
            </h1>
            <Dialog>
              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                <Plus className="mr-2" />
                Registrar Evento  
              </DialogTrigger>

              <DialogContent>
                <FormCadastroEventoGestor />
              </DialogContent>
            </Dialog>
          </div>

          {/* Gráficos  */}
          <section className="py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border rounded-xl p-4 md:col-span-1">
                <ParadasComparadasWidget />
              </div>
              <div className="bg-white border rounded-xl p-4 md:col-span-2">
                <TopMotivosTempoWidget />
              </div>
            </div>
          </section>
        </div>

        {/* Listagem de eventos */}
        <section id="listagem_eventos">
          <div className="flex items-center gap-5 mb-4">
            <h1 className="text-4xl font-semibold">Listagem de Eventos</h1>
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

            {/* Busca */}
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

            {/* Linha de Quantidade e Ordenar e Filtrar */}
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

              <TableListagens
                data={dadosExibidos}
                columns={colunasEventos}
                enableSelection={true}
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
                solicitarJustificativa={modalJustificativa}
              />

            </TabsContent>


            {/* Tab paradas justificadas */}
            <TabsContent value="justificadas" className="text-md">

              <TableListagens
                data={paradasJustificadas}
                columns={colunasEventos}
                enableSelection={true}
                acoesDropdown={acoesDropdown}
                onSelectedChange={setSelecionados}
                solicitarJustificativa={modalJustificativa}
              />
            </TabsContent>


            {/* Tab paradas não justificadas */}
            <TabsContent value="nao-justificadas" className="text-md">
              <TableListagens
                data={paradasNaoJustificadas}
                columns={colunasEventos}
                enableSelection={true}
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