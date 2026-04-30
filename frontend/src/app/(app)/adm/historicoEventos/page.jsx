"use client"

import { ParadasComparadasWidget } from "@/features/eventos/ParadasComparadasWidget";
import { TopMotivosTempoWidget } from "@/features/eventos/TopMotivosTempoWidget";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { Plus, Search, Upload, File, Pencil, Trash2, Clock4, EyeIcon, BellRing } from "lucide-react";
import { useState, useMemo } from "react";

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

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

// import { Columns3Icon, ChevronDownIcon, TrendingUpIcon } from "lucide-react"




const colunasMaquinas = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' }, /* id da máquina */
  { id: 'maquina', key: 'maquina', label: 'Máquina' },
  {
    id: 'status',
    key: 'status',
    label: 'Status',
    className: 'text-center justify-center',
    icone: (valor) => {
      const config = {
        "Produzindo": {
          variant: "outline",
          className: "bg-green-500/15 text-green-600 text-sm font-semibold border-none"
        },
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

const dadosExibidos = [
  { id: 1, maquina: 'Máquina A', status: 'Produzindo', data: '26/03 (14:08 - Ativo)', duracao: '20:08', motivo: 'Motivo 1', justificada: true },
  { id: 2, maquina: 'Máquina B', status: 'Parada', data: '26/03 (13:09 - 13:40)', duracao: '13:09', motivo: 'Aguardando Justificativa', justificada: false },
  { id: 3, maquina: 'Máquina C', status: 'Setup', data: '26/03 (06:30 - 19:06)', duracao: '06:30', motivo: 'Troca de Molde', justificada: true },
  { id: 4, maquina: 'Máquina D', status: 'Parada', data: '26/03 (14:10 - 14:45)', duracao: '00:35', motivo: 'Aguardando Justificativa', justificada: false },
  { id: 5, maquina: 'Máquina E', status: 'Setup', data: '26/03 (14:10 - 14:45)', duracao: '00:35', motivo: 'Limpeza', justificada: true },
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

  const paradasJustificadas = useMemo(
    () => dadosExibidos.filter(d => d.status === 'Parada' && d.justificada),
    []
  );

  const paradasNaoJustificadas = useMemo(
    () => dadosExibidos.filter(d => d.status === 'Parada' && !d.justificada),
    []
  );

  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden"
      style={{
        backgroundImage: "url('/bg_app.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >

      <div className="w-full mt-8 pt-0 pb-10 px-4 space-y-4">
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
              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold">
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
        <section className=" p-6">
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
          <div className="flex items-center justify-between px-4 lg:px-6">
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
          <TabsList className="hidden sm:flex">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="justificadas">
              Justificadas
              <Badge variant="secondary">
                {paradasJustificadas.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="nao-justificadas">
              Não Justificadas
              <Badge variant="secondary">
                {paradasNaoJustificadas.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Tab todos */}
          <TabsContent value="todos" className="px-4">
            {dadosExibidos.length > 0 ? (
              <TableListagens
                data={dadosExibidos}
                columns={colunasMaquinas}
                enableSelection={true}
                acoesDropdown={acoesDropdown}
              />
            ) : (
              <EmptyState busca="" />
            )}
          </TabsContent>

          {/* Tab paradas justificadas */}
          <TabsContent value="justificadas" className="px-4">
            {paradasJustificadas.length > 0 ? (
              <TableListagens
                data={paradasJustificadas}
                columns={colunasMaquinas}
                enableSelection={true}
                acoesDropdown={acoesDropdown}
              />
            ) : (
              <EmptyState busca="Paradas Justificadas" />
            )}
          </TabsContent>

          {/* Tab paradas não justificadas */}
          <TabsContent value="nao-justificadas" className="px-4">
            {paradasNaoJustificadas.length > 0 ? (
              <TableListagens
                data={paradasNaoJustificadas}
                columns={colunasMaquinas}
                enableSelection={true}
                acoesDropdown={acoesDropdown}
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