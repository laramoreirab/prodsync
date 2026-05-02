"use client"

import Header from "@/components/ui/topbar";
import { MotivoRefugoMaquinaWidget } from "@/features/maquinas/MotivoRefugoMaquinaWidget";
import { MotivoSetupMaquinaWidget } from "@/features/maquinas/MotivoSetupMaquinaWidget";
import { OEEMaquinaWidget } from "@/features/maquinas/OEEMaquinaWidget";
import { OEEEvolucaoMaquinaWidget } from "@/features/maquinas/OEEEvolucaoMaquinaWidget";
import { VelocidadeMaquinaWidget } from "@/features/maquinas/VelocidadeMaquinaWidget";

import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";

import { BellRing, Pencil } from "lucide-react";

import { use } from "react";
import Link from "next/link";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const colunasMaquina = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' }, /* id da máquina */
  { id: 'maquina', key: 'maquina', label: 'Máquina' },
  {
    id: 'status',
    key: 'status',
    label: 'Status',
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
  { id: 'data', key: 'data', label: 'Data (Início - Fim)' },
  { id: 'duracao', key: 'duracao', label: 'Duração' },
  { id: 'motivo', key: 'motivo', label: 'Motivo' },
  {
    id: 'produzido', key: 'produzido', label: 'Produzido', className: 'text-center justify-center',
    icone: (valor) => {
      return (
        <Badge variant="outline" className="bg-green-500/15 text-green-600 text-sm font-semibold border-none">
          {valor}
        </Badge>
      );
    }
  },
  {
    id: 'refugo', key: 'refugo', label: 'Refugo', className: 'text-center justify-center',
    icone: (valor) => {
      return (
        <Badge variant="destructive" className="font-semibold text-sm border-none">
          {valor}
        </Badge>
      );
    }
  },
];

const colunasApontamento = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' }, /* id da máquina */
  { id: 'op', key: 'op', label: 'OP' },
  { id: 'data', key: 'data', label: 'Data (Início - Fim)' },
  {
    id: 'produzido', key: 'produzido', label: 'Produzido', className: 'text-center justify-center',
    icone: (valor) => {
      return (
        <Badge variant="outline" className="bg-green-500/15 text-green-600 text-sm font-semibold border-none">
          {valor}
        </Badge>
      );
    }
  },
  {
    id: 'refugo', key: 'refugo', label: 'Refugo', className: 'text-center justify-center',
    icone: (valor) => {
      return (
        <Badge variant="destructive" className="font-semibold text-sm border-none">
          {valor}
        </Badge>
      );
    }
  },
  { id: 'observacao', key: 'observacao', label: 'Observação' },
];

const dadosExibidos = [
  { id: 1, maquina: 'Máquina A', status: 'Setup', data: '26/03 (08:00 - 09:00)', duracao: '00:35', motivo: 'Troca de ferramenta', produzido: '15', refugo: '2' },
  { id: 2, maquina: 'Máquina B', status: 'Parada', data: '06/01 (09:30 - 10:15)', duracao: '00:45', motivo: 'Manutenção corretiva', produzido: '10', refugo: '5' },
  { id: 3, maquina: 'Máquina C', status: 'Setup', data: '13/09 (10:15 - 10:35)', duracao: '00:20', motivo: 'Ajuste de parâmetros', produzido: '20', refugo: '1' },
  { id: 4, maquina: 'Máquina D', status: 'Parada', data: '30/09 (11:00 - 12:00)', duracao: '01:00', motivo: 'Falha elétrica', produzido: '5', refugo: '8' },
];

export default function MaquinaDetalhePage({ params }) {
  const { id } = use(params);
  const maquinaId = Number(id);

  const dadosApontamento = [
    { id: 1, op: '0098', data: '26/03 (08:00 - 09:00)', duracao: '00:35', produzido: '15', refugo: '2', observacao: 'Troca de ferramenta' },
    { id: 2, op: '1234', data: '06/01 (09:30 - 10:15)', duracao: '00:45', produzido: '10', refugo: '5', observacao: 'Manutenção corretiva' },
    { id: 3, op: '5678', data: '13/09 (10:15 - 10:35)', duracao: '00:20', produzido: '20', refugo: '1', observacao: 'Ajuste de parâmetros' },
    { id: 4, op: '9012', data: '30/09 (11:00 - 12:00)', duracao: '01:00', produzido: '5', refugo: '8', observacao: 'Refugo elevado devido a falta de aquecimento' },
    { id: 5, op: '1223', data: '28/03 (12:00 - 14:00)', duracao: '01:00', produzido: '6', refugo: '8', observacao: 'Retirada de amostras para o laboratório de qualidade' },
    { id: 6, op: '1206', data: '30/07 (17:00 - 18:00)', duracao: '01:00', produzido: '13', refugo: '6', observacao: 'Finalização de OP' },
    { id: 7, op: '8912', data: '20/09 (16:00 - 19:00)', duracao: '01:00', produzido: '20', refugo: '5', observacao: 'Falta de material' },
    { id: 8, op: '0607', data: '20/09 (16:00 - 19:00)', duracao: '01:00', produzido: '20', refugo: '5', observacao: 'Boa qualidade' },
  ];

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full mt-8 pb-10 px-8 space-y-4">

        <div className="flex justify-start">
          <h1 className="text-4xl font-semibold text-black pb-0 inline-block">
            Máquina #{maquinaId}
          </h1>
        </div>

        {/* SEÇÃO 1: Refugo + Setup */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <MotivoRefugoMaquinaWidget maquinaId={maquinaId} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <MotivoSetupMaquinaWidget maquinaId={maquinaId} />
          </div>
        </section>

        {/* SEÇÃO 2: OEE Gauges */}
        <section className="bg-white border-2 rounded-2xl p-4 shadow-sm">
          <OEEMaquinaWidget maquinaId={maquinaId} />
        </section>

        {/* SEÇÃO 3: Evolução OEE + Velocidade */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <OEEEvolucaoMaquinaWidget maquinaId={maquinaId} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <VelocidadeMaquinaWidget maquinaId={maquinaId} />
          </div>
        </section>

        {/* Listagem de máquinas */}
        <section>
          <div>
          <h2 className="text-4xl font-semibold">Histórico de Eventos da Máquina</h2>
          <TableListagens
            /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
            data={dadosExibidos} columns={colunasMaquina}
            acoesDropdown={(maquina) => (
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
            )}

          />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Histórico de Apontamentos da Máquina</h2>
            <TableListagens
            /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
            data={dadosApontamento} columns={colunasApontamento}
            acoesDropdown={(apontamento) => (
              <>
               <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`ordemDeProducao/${apontamento.op}`}>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      Ver OP relacionada
                    </Link>
                  </DropdownMenuItem>
              </>
            )}

          />
          </div>
        </section>

      </div>

    </main>
  );
}