"use client";

import { OPAtivasKPIWidget }     from "@/features/ordens/OPAtivasKPIWidget";
import { OPAtrasadasKPIWidget }  from "@/features/ordens/OPAtrasadasKPIWidget";
import { OPPecasBoasKPIWidget }  from "@/features/ordens/OPPecasBoasKPIWidget";
import { OPRefugoKPIWidget }     from "@/features/ordens/OPRefugoKPIWidget";
import { OPEficienciaWidget }    from "@/features/ordens/OPEficienciaWidget";
import { OPTopRefugoWidget }     from "@/features/ordens/OPTopRefugoWidget";
import { OPCargaSetorWidget }    from "@/features/ordens/OPCargaSetorWidget";
import { OPStatusWidget }        from "@/features/ordens/OPStatusWidget";
import { OPConcluidasDiaWidget } from "@/features/ordens/OPConcluidasDiaWidget";
import { useEffect, useState } from "react";

import { useState, useEffect } from "react";
import { useOps } from "@/hooks/useOps";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowDown, Flame, Loader2, MoveHorizontal, Pencil, Plus, EyeIcon, Trash2, Search } from 'lucide-react';
import TableListagens from "@/components/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import FormExclusaoOp from "@/components/ui/forms/ops/formExclusaoOp";
import FormCadastroOp from "@/components/ui/forms/ops/formCadastroOp";
import FormEdicaoOp from "@/components/ui/forms/ops/formEdicaoOp";

const colunasOrdemProd = [
  {
    id: "id",
    key: "id",
    label: "ID",
    className: "w-1/7"
  },
  {
    id: "codigo_lote",
    key: "codigo_lote",
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
    id: "status_op",
    key: "status_op",
    label: 'Status',
    className: "text-center",
    icone: (valor) => {
      const config = {
        "Produzindo": {
          variant: "outline",
          className: "bg-green-500/15 text-green-600 text-sm font-semibold border-none"
        },
        "Setup": {
          variant: "secondary",
          className: "bg-[#fffbea] text-amarelo font-semibold text-sm border-none"
        },
        "Parada": {
          variant: "destructive",
          className: "bg-vermelho-vivido/10 text-vermelho-vivido font-semibold text-sm border-none"
        },
        "Concluída": {
          variant: "outline",
          className: "bg-blue-500/10 text-blue-600 text-sm font-semibold border-none"
        },
        "Aguardando Início": {
          variant: "outline",
          className: "bg-[#ECECEC] text-[#636F87] text-sm font-semibold border-none"
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
    id: "progresso",
    key: "progresso",
    label: "Progresso",
    className: "text-center"
  },
];



export default function OrdensDeProducaoGestor() {
<<<<<<< HEAD
  const [setorId, setSetorId] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.id_setor) setSetorId(payload.id_setor);
    } catch {
      // token ausente ou malformado
    }
  }, []);

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-semibold text-black border-b-4 border-[var(--secondary-foreground)] pb-0 inline-block">
            Ordens de Produção
          </h1>
          <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[var(--secondary-foreground)] hover:bg-[var(--azul-cobalto)] text-white text-sm font-medium transition-colors shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova OP
          </button>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-xl p-4 h-24"><OPAtivasKPIWidget setorId={setorId} /></div>
          <div className="bg-white border rounded-xl p-4 h-24"><OPAtrasadasKPIWidget setorId={setorId} /></div>
          <div className="bg-white border rounded-xl p-4 h-24"><OPPecasBoasKPIWidget setorId={setorId} /></div>
          <div className="bg-white border rounded-xl p-4 h-24"><OPRefugoKPIWidget setorId={setorId} /></div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-6"><OPEficienciaWidget setorId={setorId} /></div>
          <div className="bg-white border rounded-xl p-6"><OPTopRefugoWidget setorId={setorId} /></div>
          <div className="bg-white border rounded-xl p-6"><OPCargaSetorWidget setorId={setorId} /></div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border rounded-xl p-6 md:col-span-2"><OPStatusWidget setorId={setorId} /></div>
          <div className="bg-white border rounded-xl p-6 md:col-span-3"><OPConcluidasDiaWidget setorId={setorId} /></div>
        </section>
=======

  const dadosExibidos = [
    { id: 1, codigo_lote: 'Ana Silva', prioridade: 'Baixa', setor: 'Escavadeiras', status_op: 'Produzindo', progresso: '25%' },
    { id: 2, codigo_lote: 'Carlos Souza', prioridade: 'Crítica', setor: 'Gestor', status_op: 'Setup', progresso: '35%' },
    { id: 3, codigo_lote: 'Bruno Costa', prioridade: 'Alta', setor: 'Operador', status_op: 'Parada', progresso: '55%' },
    { id: 4, codigo_lote: 'Bia Gonçalves', prioridade: 'Média', setor: 'Gestor', status_op: 'Setup', progresso: '85%' },
    { id: 5, codigo_lote: 'Julia Silva', prioridade: 'Baixa', setor: 'Gestor', status_op: 'Aguardando Início', progresso: '15%' },
    { id: 6, codigo_lote: 'Carol Silva', prioridade: 'Baixa', setor: 'Gestor', status_op: 'Aguardando Início', progresso: '15%' },
    { id: 7, codigo_lote: 'Guilherme Santos', prioridade: 'Baixa', setor: 'Gestor', status_op: 'Aguardando Início', progresso: '15%' },
    { id: 8, codigo_lote: 'Felipe Moraes', prioridade: 'Baixa', setor: 'Gestor', status_op: 'Concluída', progresso: '15%' },
    { id: 9, codigo_lote: 'Arthur Martins', prioridade: 'Baixa', setor: 'Gestor', status_op: 'Aguardando Início', progresso: '15%' },
  ];

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="p-8">

        <div className="w-full space-y-4">
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

                </DialogContent>
              </Dialog>
            </div>
          </div>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-xl p-4"><OPAtivasKPIWidget /></div>
            <div className="bg-white border rounded-xl p-4"><OPAtrasadasKPIWidget /></div>
            <div className="bg-white border rounded-xl p-4"><OPPecasBoasKPIWidget /></div>
            <div className="bg-white border rounded-xl p-4"><OPRefugoKPIWidget /></div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl p-6"><OPEficienciaWidget /></div>
            <div className="bg-white border rounded-xl p-6"><OPTopRefugoWidget /></div>
            <div className="bg-white border rounded-xl p-6"><OPCargaSetorWidget /></div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white border rounded-xl p-6 md:col-span-2"><OPStatusWidget /></div>
            <div className="bg-white border rounded-xl p-6 md:col-span-3"><OPConcluidasDiaWidget /></div>
          </section>
        </div>

        {/* Listagem de OPs */}
        <section>
          <div className="flex items-center py-8 gap-5">
            <h1 className="text-4xl w-30 font-semibold">OPs</h1>
            <hr className="bg-black flex-1 h-1" />
          </div>

          {/* Tabela */}
          <TableListagens
            data={dadosExibidos}
            columns={colunasOrdemProd}
            enableSelection={true}
            acoesDropdown={(op) => (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`ordensDeProducao/${op.id}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Link>
                </DropdownMenuItem>

                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4 text-primary" />
                      Editar OP
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>

                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-vermelho-vivido" />
                      Excluir
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>

                  </DialogContent>
                </Dialog>
              </>
            )}
          />
        </section>

>>>>>>> origin/front_bia
      </div>
    </main>
  );
}
