"use client";
import Link from "next/link"; import Image from "next/image";
import { use, useState, useEffect } from "react";

import TableListagens from "@/components/table";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";
import { DataEvento } from "@/components/ui/dataEvento";

import { Badge } from "@/components/ui/badge";
import { BellRing, Pencil, ChevronDown, Trash2, Flame, Plus, Search, EyeIcon } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";

import { OPProgressoWidget } from "@/features/ordens/OPProgressoWidget";
import { OPOEEDetalheWidget } from "@/features/ordens/OPOEEDetalheWidget";

import FormExclusaoOp from "@/components/ui/forms/ops/formExclusaoOp";
import FormEdicaoOp from "@/components/ui/forms/ops/formEdicaoOp";
import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEventoGestor";

import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import FormEdicaoEvento from "@/components/ui/forms/historicoEventos/formEdicaoEvento";
import ModalSucessNotificacao from "@/components/ui/forms/historicoEventos/modalSucessNotificacao";

const colunasOP = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' },
  {
    id: 'status',
    key: 'evento',
    label: 'Status',
    className: 'text-center justify-center',
    icone: (valor) => {
      const config = {
        "Setup": { variant: "setup" },
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
];

const colunasApontamento = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' },
  {
    id: 'data',
    key: 'data',
    label: 'Data (Início - Fim)',
    icone: (valor, row) => (
      <DataEvento inicio={row.inicio} fim={row.fim} />
    )
  },
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

const dadosOP = [
  {
    id: 101,
    evento: "Setup",
    inicio: "2026-05-12T07:00:00",
    fim: "2026-05-12T07:45:00",
    motivo: "Troca de molde - Produto A para B"
  },
  {
    id: 102,
    evento: "Setup",
    inicio: "2026-05-12T07:45:00",
    fim: "2026-05-12T10:00:00",
    motivo: "Operação normal"
  },
  {
    id: 103,
    evento: "Parada",
    inicio: "2026-05-12T10:00:00",
    fim: "2026-05-12T10:20:00",
    motivo: "Manutenção corretiva - Sensor de presença"
  },
  {
    id: 104,
    evento: "Setup",
    inicio: "2026-05-12T10:20:00",
    fim: "2026-05-12T12:00:00",
    motivo: "Fluxo contínuo"
  },
  {
    id: 105,
    evento: "Parada",
    inicio: "2026-05-12T12:00:00",
    fim: "2026-05-12T13:00:00",
    motivo: "Intervalo de refeição"
  },
  {
    id: 106,
    evento: "Setup",
    inicio: "2026-05-12T13:00:00",
    fim: "2026-05-12T13:15:00",
    motivo: "Limpeza de bicos injetores"
  },
  {
    id: 107,
    evento: "Setup",
    inicio: "2026-05-12T13:15:00",
    fim: "2026-05-12T15:30:00",
    motivo: "Operação normal"
  },
  {
    id: 108,
    evento: "Parada",
    inicio: "2026-05-12T15:30:00",
    fim: "2026-05-12T15:50:00",
    motivo: "Aguardando matéria-prima (Logística)"
  },
  {
    id: 109,
    evento: "Setup",
    inicio: "2026-05-12T15:50:00",
    fim: "2026-05-12T17:00:00",
    motivo: "Operação normal"
  },
  {
    id: 110,
    evento: "Parada",
    inicio: "2026-05-12T17:00:00",
    fim: "2026-05-12T17:10:00",
    motivo: "Troca de turno"
  },
  {
    id: 111,
    evento: "Setup",
    inicio: "2026-05-12T17:10:00",
    fim: "2026-05-12T17:50:00",
    motivo: "Ajuste de parâmetros térmicos"
  },
  {
    id: 112,
    evento: "Setup",
    inicio: "2026-05-12T17:50:00",
    fim: "2026-05-12T20:00:00",
    motivo: "Operação noturna estável"
  },
  {
    id: 113,
    evento: "Parada",
    inicio: "2026-05-12T20:00:00",
    fim: "2026-05-12T20:45:00",
    motivo: "Falta de energia elétrica"
  },
  {
    id: 114,
    evento: "Setup",
    inicio: "2026-05-12T20:45:00",
    fim: "2026-05-12T21:00:00",
    motivo: "Reinicialização de sistemas"
  },
  {
    id: 115,
    evento: "Setup",
    inicio: "2026-05-12T21:00:00",
    fim: "2026-05-12T23:00:00",
    motivo: "Finalização de lote"
  }
];

const dadosApontamento = [
  { id: 1, inicio: "2026-05-12T08:00:00", fim: "2026-05-12T09:00:00", produzido: 150, refugo: 0, observacao: "Início do turno sem intercorrências." },
  { id: 2, inicio: "2026-05-12T09:00:00", fim: "2026-05-12T10:00:00", produzido: 142, refugo: 3, observacao: "Ajuste de velocidade na esteira." },
  { id: 3, inicio: "2026-05-12T10:00:00", fim: "2026-05-12T11:00:00", produzido: 130, refugo: 12, observacao: "Troca de lote de matéria-prima." },
  { id: 4, inicio: "2026-05-12T11:00:00", fim: "2026-05-12T12:00:00", produzido: 155, refugo: 1, observacao: "Ritmo de Setup acima da meta." },
  { id: 5, inicio: "2026-05-12T13:00:00", fim: "2026-05-12T14:00:00", produzido: 148, refugo: 2, observacao: "Retorno do intervalo de almoço." },
  { id: 6, inicio: "2026-05-12T14:00:00", fim: "2026-05-12T15:00:00", produzido: 120, refugo: 18, observacao: "Instabilidade na pressão pneumática." },
  { id: 7, inicio: "2026-05-12T15:00:00", fim: "2026-05-12T16:00:00", produzido: 145, refugo: 4, observacao: "Manutenção preventiva rápida." },
  { id: 8, inicio: "2026-05-12T16:00:00", fim: "2026-05-12T17:00:00", produzido: 151, refugo: 0, observacao: "Setup finalizada com sucesso." },
  { id: 9, inicio: "2026-05-13T08:00:00", fim: "2026-05-13T09:00:00", produzido: 147, refugo: 1, observacao: "Aquecimento global do sistema." },
  { id: 10, inicio: "2026-05-13T09:00:00", fim: "2026-05-13T10:00:00", produzido: 138, refugo: 6, observacao: "Limpeza técnica do bocal de saída." },
  { id: 11, inicio: "2026-05-13T10:00:00", fim: "2026-05-13T11:00:00", produzido: 160, refugo: 0, observacao: "Recorde de produtividade por hora." },
  { id: 12, inicio: "2026-05-13T11:00:00", fim: "2026-05-13T12:00:00", produzido: 144, refugo: 3, observacao: "Verificação de qualidade rotineira." },
  { id: 13, inicio: "2026-05-13T13:00:00", fim: "2026-05-13T14:00:00", produzido: 149, refugo: 2, observacao: "Substituição de operador (troca de turno)." },
  { id: 14, inicio: "2026-05-13T14:00:00", fim: "2026-05-13T15:00:00", produzido: 115, refugo: 25, observacao: "Falha mecânica no sensor de presença." },
  { id: 15, inicio: "2026-05-13T15:00:00", fim: "2026-05-13T16:00:00", produzido: 153, refugo: 1, observacao: "Recuperação de fluxo pós-falha." },
  { id: 16, inicio: "2026-05-14T06:00:00", fim: "2026-05-14T07:00:00", produzido: 160, refugo: 0, observacao: "Início do 1º turno - Setup concluído." },
  { id: 17, inicio: "2026-05-14T07:00:00", fim: "2026-05-14T08:00:00", produzido: 158, refugo: 2, observacao: "Setup nominal estável." },
  { id: 18, inicio: "2026-05-14T08:00:00", fim: "2026-05-14T09:00:00", produzido: 140, refugo: 15, observacao: "Problema no corte; ajuste de facas realizado." },
  { id: 19, inicio: "2026-05-14T09:00:00", fim: "2026-05-14T10:00:00", produzido: 152, refugo: 3, observacao: "Retomada após ajuste técnico." },
  { id: 20, inicio: "2026-05-14T10:00:00", fim: "2026-05-14T11:00:00", produzido: 145, refugo: 5, observacao: "Troca de paletes na expedição." },
  { id: 21, inicio: "2026-05-14T11:00:00", fim: "2026-05-14T12:00:00", produzido: 130, refugo: 8, observacao: "Queda de pressão na rede de ar." },
  { id: 22, inicio: "2026-05-14T13:00:00", fim: "2026-05-14T14:00:00", produzido: 148, refugo: 1, observacao: "Reinício pós-manutenção preventiva." },
  { id: 23, inicio: "2026-05-14T14:00:00", fim: "2026-05-14T15:00:00", produzido: 155, refugo: 0, observacao: "Alta eficiência térmica observada." },
  { id: 24, inicio: "2026-05-14T15:00:00", fim: "2026-05-14T16:00:00", produzido: 142, refugo: 6, observacao: "Teste de novo material plástico." },
  { id: 25, inicio: "2026-05-14T16:00:00", fim: "2026-05-14T17:00:00", produzido: 138, refugo: 4, observacao: "Finalização do 1º turno." },
  { id: 26, inicio: "2026-05-14T18:00:00", fim: "2026-05-14T19:00:00", produzido: 150, refugo: 2, observacao: "Início do 2º turno - Clima ameno." },
  { id: 27, inicio: "2026-05-14T19:00:00", fim: "2026-05-14T20:00:00", produzido: 153, refugo: 1, observacao: "Operação padrão sem alertas." },
  { id: 28, inicio: "2026-05-14T20:00:00", fim: "2026-05-14T21:00:00", produzido: 110, refugo: 35, observacao: "Vazamento de óleo identificado e contido." },
  { id: 29, inicio: "2026-05-14T21:00:00", fim: "2026-05-14T22:00:00", produzido: 147, refugo: 3, observacao: "Setup compensatória pós-reparo." },
  { id: 30, inicio: "2026-05-14T22:00:00", fim: "2026-05-14T23:00:00", produzido: 159, refugo: 0, observacao: "Estabilidade total atingida." }
];

export default function OPDetalheGestor({ params }) {
  const { id } = use(params);
  const opId = id;

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="p-8">

        <div className="flex w-full flex-col gap-4 pb-10">
          <div className="mb-2 flex justify-start">
            <h1 className="inline-block border-b-4 border-[var(--secondary-foreground)] pb-0 text-4xl font-semibold text-black">
              Ordem de Setup
            </h1>
          </div>

          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2" />
              <div className="md:col-span-1">
                <OPProgressoWidget opId={opId} />
              </div>
            </div>
          </section>

          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <OPOEEDetalheWidget opId={opId} />
          </section>
        </div>

        {/* Listagem de Histórico de Eventos da OP */}
        <section>
          <div className="flex items-center justify-between gap-5 mt-6 mb-3">
            <h1 className="text-4xl w-[125] font-semibold">Histórico de Eventos da OP</h1>
            <Dialog>
              <DialogTrigger className="cursor-pointer bg-blue-900 flex items-center px-3 py-1.5 rounded-md text-white font-semibold text-2xl gap-2">
                <Plus size={28} className="text-white cursor-pointer" />
                Cadastrar
              </DialogTrigger>

              <DialogContent>
                <FormCadastroEvento />
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabela */}
          <TableListagens
            /* Dados e colunas a depender da pÃ¡gina [no momento estÃ¡ estÃ¡tico definido em um json, posteriormente serÃ¡ um get]  */
            data={dadosOP}
            columns={colunasOP}
            enableSelection={true}
            onEditSelected={(rows) => handleEditBatch(rows)}
            acoesDropdown={(ordemProd) => (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <EyeIcon strokeWidth={2} className="mr-1 h-4 w-4 text-primary" />
                      Ver Detalhes
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DetalhesEvento eventoId={ordemProd.op} />
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
                    <FormEdicaoEvento />
                  </DialogContent>
                </Dialog>
              </>
            )}
          />

        </section>

        {/* Listagem de Histórico de Apontamentos da OP  */}
        <section id="listagem_histApontamentos">
          <div className="flex items-center justify-between gap-5 mt-5">
            <h1 className="text-4xl w-[125] font-semibold">Histórico de Apontamentos da OP</h1>
          </div>

          {/* Tabela */}
          <div>
            <TableListagens
              /* Dados e colunas a depender da pÃ¡gina [no momento estÃ¡ estÃ¡tico definido em um json, posteriormente serÃ¡ um get]  */
              data={dadosApontamento}
              columns={colunasApontamento}
            />

          </div>
        </section>

      </div>
    </main>
  );
}