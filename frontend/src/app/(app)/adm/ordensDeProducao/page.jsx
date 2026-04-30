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
import { AlertTriangle, ArrowDown, BellRing, Flame, MoveHorizontal, Pencil, Plus } from 'lucide-react';
import TableListagens from "@/components/table";

import Link from "next/link";

const dadosOriginais = [
  { id: 1, nome: 'Ana Silva', prioridade: 'Baixa', setor: 'Escavadeiras', status: 'Produzindo', progresso: '25%' },
  { id: 2, nome: 'Carlos Souza', prioridade: 'Crítica', setor: 'Gestor', status: 'Setup', progresso: '35%' },
  { id: 3, nome: 'Bruno Costa', prioridade: 'Alta', setor: 'Operador', status: 'Parada', progresso: '55%' },
  { id: 4, nome: 'Bia Gonçalves', prioridade: 'Média', setor: 'Gestor', status: 'Setup', progresso: '85%' },
  { id: 5, nome: 'Julia Silva', prioridade: 'Baixa', setor: 'Gestor', status: 'Parada', progresso: '15%' }
];

export default function OrdensDeProducao() {

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
      icone: (valor) => {
        const config = {
          "Média": {
            variant: "outline",
            className: "border border-[var(--azul-cobalto)]",
            icon: <MoveHorizontal className="text-azul-cobalto" />
          },
          "Alta": {
            variant: "secondary",
            className: "border border-[var(--amarelo)] bg-transparent",
            icon: <AlertTriangle className="text-amarelo" />
          },
          "Crítica": {
            variant: "destructive",
            className: "border border-[var(--vermelho-vivido)] bg-transparent text-black",
            icon: <Flame className="text-vermelho-vivido" />
          },
          "Baixa": {
            variant: "destructive",
            className: "border border-gray-400 text-sm bg-transparent text-black",
            icon: <ArrowDown className="text-gray-400" />
          }
        };

        const item = config[valor] || { icon: null };
        return (
          <Badge variant="outline" className={`whitespace-nowrap ${item.className} text-sm font-medium p-2.5`}>
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
    {
      id: "progresso",
      key: "progresso",
      label: "Progresso",
    },
  ];

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full mt-8 pb-10 px-8 space-y-4">

        {/* TÍTULO */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
            Ordens de Produção
          </h1>

          {/* Modal de Criação de OP */}
          <div className="modal_cadastro">
            <Dialog>
              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold">
                <Plus className="mr-2" />
                Criar OP
              </DialogTrigger>
              <DialogContent>
                <h1>criar op</h1>
              </DialogContent>

            </Dialog>
          </div>
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
          acoesDropdown={(ordemProd) => (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                    <Pencil className="mr-2 h-4 w-4 text-primary" />
                    Editar
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  {/* Form para editar ordem Prod*/}
                </DialogContent>
              </Dialog>
            </>
          )}
        />


      </div>
    </main>
  );
}