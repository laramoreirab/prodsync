"use client";
import Link from "next/link"; import Image from "next/image";
import { use, useState, useEffect } from "react";

import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { BellRing, Pencil, ChevronDown, Trash2, Flame, Plus, Search, EyeIcon } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";

import { OPProgressoWidget } from "@/features/ordens/OPProgressoWidget";
import { OPOEEDetalheWidget } from "@/features/ordens/OPOEEDetalheWidget";
import { use } from "react";

import FormExclusaoOp from "@/components/ui/forms/ops/formExclusaoOp";
import FormEdicaoOp from "@/components/ui/forms/ops/formEdicaoOp";
import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEvento";

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
  { id: 'data', key: 'data', label: 'Data (InÃ­cio - Fim)' },
  { id: 'duracao', key: 'duracao', label: 'DuraÃ§Ã£o', className: 'text-center justify-center' },
  { id: 'motivo', key: 'motivo', label: 'Motivo' },
];

const dadosOP = [
  { id: 1, evento: 'Parada', data: '26/03 (08:00 - 09:00)', duracao: '00:35', motivo: 'Troca de ferramenta' },
  { id: 2, evento: 'Setup', data: '06/01 (09:30 - 10:15)', duracao: '00:45', motivo: 'ManutenÃ§Ã£o corretiva' },
  { id: 3, evento: 'Setup', data: '13/09 (10:15 - 10:35)', duracao: '00:20', motivo: 'Ajuste de parÃ¢metros' },
  { id: 4, evento: 'Parada', data: '30/09 (11:00 - 12:00)', duracao: '01:00', motivo: 'Refugo elevado devido a falta de aquecimento' },
  { id: 5, evento: 'Setup', data: '28/03 (12:00 - 14:00)', duracao: '01:00', motivo: 'Retirada de amostras para o laboratÃ³rio de qualidade' },
  { id: 6, evento: 'Setup', data: '30/07 (17:00 - 18:00)', duracao: '01:30', motivo: 'FinalizaÃ§Ã£o de evento' },
  { id: 7, evento: 'Parada', data: '20/09 (16:00 - 19:00)', duracao: '01:00', motivo: 'Falta de material' },
  { id: 8, evento: 'Parada', data: '20/09 (16:00 - 19:00)', duracao: '01:00', motivo: 'Boa qualidade' },
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
              Ordem de Produção
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
                    <DetalhesEvento eventoId={ordermProd.op} />
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

      </div>
    </main>
  );
}
