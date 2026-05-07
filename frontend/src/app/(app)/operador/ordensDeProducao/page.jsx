"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowDown, Flame, MoveHorizontal, Pencil, Plus, EyeIcon, Trash2 } from 'lucide-react';
import TableListagens from "@/components/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import Link from "next/link";

const dadosOriginais = [
  { id: 1, nome: 'Ana Silva', prioridade: 'Baixa', setor: 'Escavadeiras', status: 'Produzindo', progresso: '25%' },
  { id: 2, nome: 'Carlos Souza', prioridade: 'Crítica', setor: 'Gestor', status: 'Setup', progresso: '35%' },
  { id: 3, nome: 'Bruno Costa', prioridade: 'Alta', setor: 'Operador', status: 'Parada', progresso: '55%' },
  { id: 4, nome: 'Bia Gonçalves', prioridade: 'Média', setor: 'Gestor', status: 'Setup', progresso: '85%' },
  { id: 5, nome: 'Julia Silva', prioridade: 'Baixa', setor: 'Gestor', status: 'Aguardando Início', progresso: '15%' },
  { id: 6, nome: 'Carol Silva', prioridade: 'Baixa', setor: 'Gestor', status: 'Aguardando Início', progresso: '15%' },
  { id: 7, nome: 'Guilherme Santos', prioridade: 'Baixa', setor: 'Gestor', status: 'Aguardando Início', progresso: '15%' },
  { id: 8, nome: 'Felipe Moraes', prioridade: 'Baixa', setor: 'Gestor', status: 'Concluída', progresso: '15%' },
  { id: 9, nome: 'Arthur Martins', prioridade: 'Baixa', setor: 'Gestor', status: 'Aguardando Início', progresso: '15%' },
];

export default function OrdensDeProducao() {

  const colunasOrdemProd = [
    {
      id: "id",
      key: "id",
      label: "ID",
      className: "w-25 text-center justify-center"
    },
    {
      id: "prioridade",
      key: "prioridade",
      label: "Prioridade",
      className: "lg:pl-25 w-40",
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
      id: "status",
      key: "status",
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
            className: "bg-[#fffbea] text-amarelo font-semibold text-sm "
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
      className: "text-center"
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
        </div>

        {/*SEÇÃO 1: Graphs*/}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-xl p-4">Aguardando Início</div>
          {/* <div className="bg-white border rounded-xl p-4">Em andamento <OPProgressoWidget /></div> */}
          <div className="bg-white border rounded-xl p-4">Concluídas</div>

          {/* Quadro prioridades */}
          <div className="bg-white border rounded-xl p-4">
            <div>
              {dadosOriginais.prioridade}
            </div>
            <div>

            </div>

          </div>
        </section>

        {/* Tabela sem filtros ainda */}
        <section>
          <h1>Historico de Eventos da OP</h1>
          <TableListagens
            /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
            data={dadosOriginais}
            columns={colunasOrdemProd}
            acoesDropdown={(ordemProd) => (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`ordensDeProducao/${ordemProd.id}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          />




        </section>

      </div>
    </main>
  );
}