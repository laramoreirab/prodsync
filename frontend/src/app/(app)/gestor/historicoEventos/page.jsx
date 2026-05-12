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


import FilterDropdown from "@/components/ui/filterDropdown";
import OrdenarDropdown from "@/components/ui/ordenarDropdown";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEvento";
import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
import FormEdicaoEvento from "@/components/ui/forms/historicoEventos/formEdicaoEvento";
import ModalSucessNotificacao from "@/components/ui/forms/historicoEventos/modalSucessNotificacao";


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

export default function HistoricoEventosGestor() {

  const dadosExibidos = [
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

        </DialogContent>
      </Dialog>

    </>
  );

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="p-8">

        <div className="w-full pt-0 pb-10 px-4 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-semibold text-black border-b-4 border-[var(--secondary-foreground)] pb-0 inline-block">
              Histórico de Eventos
            </h1>
            <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[var(--secondary-foreground)] hover:bg-[#004aad] text-white text-sm font-medium transition-colors shadow-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Registrar Eventos
            </button>
          </div>

          <section className="p-6">
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
        <section>
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