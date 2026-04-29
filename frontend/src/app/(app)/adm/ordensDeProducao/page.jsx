"use client"

import { OPAtivasKPIWidget } from "@/features/ordens/OPAtivasKPIWidget";
import { OPAtrasadasKPIWidget } from "@/features/ordens/OPAtrasadasKPIWidget";
import { OPPecasBoasKPIWidget } from "@/features/ordens/OPPecasBoasKPIWidget";
import { OPRefugoKPIWidget } from "@/features/ordens/OPRefugoKPIWidget";
import { OPEficienciaWidget } from "@/features/ordens/OPEficienciaWidget";
import { OPTopRefugoWidget } from "@/features/ordens/OPTopRefugoWidget";
import { OPCargaSetorWidget } from "@/features/ordens/OPCargaSetorWidget";
import { OPStatusWidget } from "@/features/ordens/OPStatusWidget";
import { OPConcluidasDiaWidget } from "@/features/ordens/OPConcluidasDiaWidget";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Flame, AlertTriangle, ArrowDown, MoveHorizontal } from 'lucide-react';

import TableListagens from "@/components/table";

const dadosOriginais = [
  { id: 1, nome: 'Ana Silva', prioridade: 'Baixa', setor: 'Escavadeiras', status: 'Produzindo', progresso: '25%' },
  { id: 2, nome: 'Carlos Souza', prioridade: 'Crítica', setor: 'Gestor', status: 'Setup', progresso: '35%' },
  { id: 3, nome: 'Bruno Costa', prioridade: 'Alta', setor: 'Operador', status: 'Parada', progresso: '55%' },
  { id: 4, nome: 'Bia Gonçalves', prioridade: 'Média', setor: 'Gestor', status: 'Setup', progresso: '85%' },
  { id: 5, nome: 'Julia Silva', prioridade: 'Baixa', setor: 'Gestor', status: 'Parada', progresso: '15%' }
];

export default function OrdensDeProducaoPage() {

  const colunasOrdemProd = [
    {
      id: "id",
      key: "id",
      label: "ID",
      className: "w-1/7"
    },
    {
      id: "nome",
      key: "nome",
      label: "Nome",
      className: "w-1/5"
    },
    {
      id: "prioridade",
      key: "prioridade",
      label: "Prioridade",
      className: "w-45",
       badge: (valor) => {
        const config = {
          "Média": {
            variant: "outline",
            className: "border border-[var(--azul-cobalto)] p-2  text-sm font-medium",
            icon: <MoveHorizontal size={25} />
          },
          "Alta": {
            variant: "secondary",
            className: "border border-[var(--amarelo)] p-2 bg-transparent font-medium text-sm",
            icon: <AlertTriangle size={25} />
          },
          "Crítica": {
            variant: "destructive",
            className: "font-medium border border-[var(--vermelho-vivido)] p-2 text-sm bg-transparent text-black",
            icon: <Flame size={25} />
          },
          "Baixa": {
            variant: "destructive",
            className: "font-medium border border-[var(--muted-foreground)] text-sm bg-transparent text-black",
            icon: <ArrowDown size={25} />
          }
        };

        const item= config[valor] || { icon: null };
        return (
          <Badge variant="outline" className={`whitespace-nowrap ${item.className}`}>
            {item.icon}
            {valor}
          </Badge>
        );
      }
    },
    {
      id: "setor",
      key: "setor",
      label: "Setor",
      className: "w-1/5",
    },
    {
      id: "status",
      key: "status",
      label: 'Status',
      badge: (valor) => {
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
    {
      id: "progresso",
      key: "progresso",
      label: "Progresso",
    },
  ];

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

      <div className="w-full max-w-6xl mt-8 pb-10 px-4 space-y-4">

        {/* TÍTULO */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-semibold text-black border-b-4 border-[var(--secondary-foreground)] pb-0 inline-block">
            Ordens de Produção
          </h1>
          <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[var(--secondary-foreground)] hover:bg-[#004aad] text-white text-sm font-medium transition-colors shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova OP
          </button>
        </div>

        {/*SEÇÃO 1: Graphs*/}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-xl p-4"><OPAtivasKPIWidget /></div>
          <div className="bg-white border rounded-xl p-4"><OPAtrasadasKPIWidget /></div>
          <div className="bg-white border rounded-xl p-4"><OPPecasBoasKPIWidget /></div>
          <div className="bg-white border rounded-xl p-4"><OPRefugoKPIWidget /></div>
        </section>

        {/* SEÇÃO 2: Graphs*/}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-6"><OPEficienciaWidget /></div>
          <div className="bg-white border rounded-xl p-6"><OPTopRefugoWidget /></div>
          <div className="bg-white border rounded-xl p-6"><OPCargaSetorWidget /></div>
        </section>

        {/* SEÇÃO 3: Graphs */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border rounded-xl p-6 md:col-span-2"><OPStatusWidget /></div>
          <div className="bg-white border rounded-xl p-6 md:col-span-3"><OPConcluidasDiaWidget /></div>
        </section>

        {/* Tabela sem filtros ainda */}
        <TableListagens
          /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
          data={dadosOriginais}
          columns={colunasOrdemProd}
          enableSelection={true}
          // 1. Para a ação "ver detalhes" Url com base na linha clicada
          viewLink={(row) => `/maquinas/${row.id}`}
          // 2.  modais de Editar e Excluir para a tabela renderizar
          dialogs={{
            edit: (row) => (
              <DialogContent className="rounded-lg">


                {/* colocar {row.nome} e assim por diante no placehoder pra saber o que está sendo editado */}
              </DialogContent>
            ),
            delete: (row) => (
              <DialogContent>



              </DialogContent>
            ),
          }}
        />


      </div>
    </main>
  );
}