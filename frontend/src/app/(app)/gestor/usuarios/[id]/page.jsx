"use client"

import { use } from "react";
import Link from "next/link";

import { EyeIcon } from "lucide-react";

import { MetaProducaoWidget } from "@/features/operador/MetaProducaoWidget";
import { TempoParadoTempoProduzindoOperadorWidget } from "@/features/operador/TempoParadoTempoProduzindoOperadorWidget";
import { OEEOperadorWidget } from "@/features/operador/OEEOperadorWidget";
import { PecasPorDiaWidget } from "@/features/operador/PecasPorDiaWidget";
import { ProducaoPorHoraOperadorWidget } from "@/features/operador/ProducaoPorHoraOperadorWidget";
import { EficienciaMaquinaWidget } from "@/features/operador/EficienciaMaquinaWidget";

import TableListagens from "@/components/table";
import { DataEvento } from "@/components/ui/dataEvento";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";


const colunasUsuario = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' },
  { id: 'op', key: 'op', label: 'OP Afetada', className: 'w-30 text-center justify-center pl-5' },
  {
    id: 'data',
    key: 'data',
    label: 'Data (Início - Fim)',
    icone: (valor, row) => (
      <DataEvento inicio={row.inicio} fim={row.fim} />
    )
  }, {
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
  {
    id: 1,
    op: "OP-2026-001",
    inicio: "2026-05-10T08:00:00",
    fim: "2026-05-10T12:00:00",
    produzido: 1250,
    refugo: 5,
    observacao: "Produção estável, sem intercorrências."
  },
  {
    id: 2,
    op: "OP-2026-001",
    inicio: "2026-05-10T13:00:00",
    fim: "2026-05-10T17:30:00",
    produzido: 1100,
    refugo: 12,
    observacao: "Troca de ferramenta no meio do turno."
  },
  {
    id: 3,
    op: "OP-2026-002",
    inicio: "2026-05-11T07:00:00",
    fim: "2026-05-11T11:00:00",
    produzido: 980,
    refugo: 45,
    observacao: "Ajuste térmico necessário no início do lote."
  },
  {
    id: 4,
    op: "OP-2026-003",
    inicio: "2026-05-11T11:30:00",
    fim: "2026-05-11T15:00:00",
    produzido: 1500,
    refugo: 2,
    observacao: "Alta performance, operador experiente."
  },
  {
    id: 5,
    op: "OP-2026-003",
    inicio: "2026-05-11T15:30:00",
    fim: "2026-05-11T19:00:00",
    produzido: 1320,
    refugo: 8,
    observacao: "Manutenção preventiva rápida realizada."
  },
  {
    id: 6,
    op: "OP-2026-004",
    inicio: "2026-05-12T08:00:00",
    fim: "2026-05-12T12:00:00",
    produzido: 800,
    refugo: 150,
    observacao: "Problema na matéria-prima (lote B-45)."
  },
  {
    id: 7,
    op: "OP-2026-005",
    inicio: "2026-05-12T13:00:00",
    fim: "2026-05-12T17:00:00",
    produzido: 1150,
    refugo: 10,
    observacao: "Normalização após troca de lote."
  },
  {
    id: 8,
    op: "OP-2026-006",
    inicio: "2026-05-13T07:00:00",
    fim: "2026-05-13T11:00:00",
    produzido: 1400,
    refugo: 4,
    observacao: "Ritmo constante, meta atingida."
  },
  {
    id: 9,
    op: "OP-2026-006",
    inicio: "2026-05-13T12:00:00",
    fim: "2026-05-13T16:00:00",
    produzido: 1280,
    refugo: 7,
    observacao: "Pequena queda de tensão na rede elétrica."
  },
  {
    id: 10,
    op: "OP-2026-007",
    inicio: "2026-05-14T08:00:00",
    fim: "2026-05-14T12:00:00",
    produzido: 600,
    refugo: 20,
    observacao: "Setup de máquina demorado (molde complexo)."
  },
  {
    id: 11,
    op: "OP-2026-008",
    inicio: "2026-05-14T13:00:00",
    fim: "2026-05-14T18:00:00",
    produzido: 1650,
    refugo: 0,
    observacao: "Lote impecável, zero refugo."
  },
  {
    id: 12,
    op: "OP-2026-009",
    inicio: "2026-05-15T07:00:00",
    fim: "2026-05-15T11:00:00",
    produzido: 1050,
    refugo: 32,
    observacao: "Testes de novos parâmetros de pressão."
  },
  {
    id: 13,
    op: "OP-2026-010",
    inicio: "2026-05-15T12:00:00",
    fim: "2026-05-15T16:00:00",
    produzido: 1220,
    refugo: 15,
    observacao: "Operador em treinamento sob supervisão."
  },
  {
    id: 14,
    op: "OP-2026-011",
    inicio: "2026-05-16T08:00:00",
    fim: "2026-05-16T12:00:00",
    produzido: 1380,
    refugo: 6,
    observacao: "Condições ideais de umidade no galpão."
  },
  {
    id: 15,
    op: "OP-2026-012",
    inicio: "2026-05-16T13:00:00",
    fim: "2026-05-16T17:00:00",
    produzido: 1410,
    refugo: 9,
    observacao: "Finalização de turno e limpeza da área."
  }
];

export default function UsuarioDetalheGestor({ params }) {
  const { id } = use(params);
  const operadorId = Number(id);

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full pb-10 p-8">
        <div className="w-full pb-10 space-y-4">
          <div className="flex justify-start">
            <h1 className="text-4xl font-semibold text-black pb-0 inline-block">
              Operador #{operadorId}
            </h1>
          </div>

          <section className="bg-white border-2 rounded-2xl p-4 shadow-sm">
            <OEEOperadorWidget operadorId={operadorId} />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <PecasPorDiaWidget operadorId={operadorId} />
            </div>
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <ProducaoPorHoraOperadorWidget operadorId={operadorId} />
            </div>
            <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
              <MetaProducaoWidget operadorId={operadorId} />
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <TempoParadoTempoProduzindoOperadorWidget operadorId={operadorId} />
            </div>
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <EficienciaMaquinaWidget operadorId={operadorId} />
            </div>
          </section>
        </div>

        {/* Listagem de Apontamentos feito pelo Usuário */}
        <section>
          <div className="flex items-center gap-5">
            <h1 className="text-4xl w-[125] font-semibold">Histórico de Apontamentos Feitos pelo Usuário</h1>
          </div>

          <div className="mt-4">
            <TableListagens
              /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
              data={dadosExibidos}
              columns={colunasUsuario}
              acoesDropdown={(usuario) => (
                <>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/adm/ordensDeProducao/${usuario.op}`}>
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