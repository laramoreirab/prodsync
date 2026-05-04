
"use client";
import { use } from "react";

import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { BellRing, Pencil } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { OPProgressoWidget } from "@/features/ordens/OPProgressoWidget";
import { OPOEEDetalheWidget } from "@/features/ordens/OPOEEDetalheWidget";

const colunasOP = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' },
  {
    id: 'evento',
    key: 'evento',
    label: 'Evento',
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


export default function OPDetalhePage({ params }) {
  const opId = use(params);

  const dadosOP = [
    { id: 1, evento: 'Parada', data: '26/03 (08:00 - 09:00)', duracao: '00:35', produzido: '15', refugo: '2', motivo: 'Troca de ferramenta' },
    { id: 2, evento: 'Setup', data: '06/01 (09:30 - 10:15)', duracao: '00:45', produzido: '10', refugo: '5', motivo: 'Manutenção corretiva' },
    { id: 3, evento: 'Setup', data: '13/09 (10:15 - 10:35)', duracao: '00:20', produzido: '20', refugo: '1', motivo: 'Ajuste de parâmetros' },
    { id: 4, evento: 'Parada', data: '30/09 (11:00 - 12:00)', duracao: '01:00', produzido: '5', refugo: '8', motivo: 'Refugo elevado devido a falta de aquecimento' },
    { id: 5, evento: 'Setup', data: '28/03 (12:00 - 14:00)', duracao: '01:00', produzido: '6', refugo: '8', motivo: 'Retirada de amostras para o laboratório de qualidade' },
    { id: 6, evento: 'Setup', data: '30/07 (17:00 - 18:00)', duracao: '01:30', produzido: '13', refugo: '6', motivo: 'Finalização de evento' },
    { id: 7, evento: 'Parada', data: '20/09 (16:00 - 19:00)', duracao: '01:00', produzido: '20', refugo: '5', motivo: 'Falta de material' },
    { id: 8, evento: 'Parada', data: '20/09 (16:00 - 19:00)', duracao: '01:00', produzido: '20', refugo: '5', motivo: 'Boa qualidade' },
  ];

  const colunasApontamento = [
      { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' },
      { id: 'op', key: 'op', label: 'OP Afetada', className: 'w-30 text-center justify-center pl-5' },
      { id: 'data', key: 'data', label: 'Data (Início - Fim)', className: 'pl-10' },
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


        <div className="mb-2 flex justify-start">
          <h1 className="inline-block border-b-4 border-[var(--secondary-foreground)] pb-0 text-4xl font-semibold text-black">
            Ordem de Produção
          </h1>
        </div>

        {/* SEÇÃO 1: Info card + Progresso */}
        <section className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">

            </div>
            <div className="md:col-span-1">
              <OPProgressoWidget opId={opId} />
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: OEE Gauges */}
        <section className="bg-white border rounded-xl p-6 shadow-sm">
          <OPOEEDetalheWidget opId={opId} />
        </section>

        <section>
          <h1>Historico de Eventos da OP</h1>
          <TableListagens
            /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
            data={dadosOP}
            columns={colunasOP}
            enableSelection={true}
            onEditSelected={(rows) => handleEditBatch(rows)}
            acoesDropdown={(apontamento) => (
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

          <h1>Histórico de Apontamentos da OP</h1>
          <TableListagens
            /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
            data={dadosApontamento}
            columns={colunasApontamento}
            acoesDropdown={(ordemProd) => (
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
        </section>

      </div>
    </main>
  );
}