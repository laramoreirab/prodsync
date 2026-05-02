"use client"

import { MetaProducaoWidget } from "@/features/operador/MetaProducaoWidget";
import { ParadasComparadasOperadorWidget } from "@/features/operador/ParadasComparadasOperadorWidget";
import { OEEOperadorWidget } from "@/features/operador/OEEOperadorWidget";
import { PecasPorDiaWidget } from "@/features/operador/PecasPorDiaWidget";
import { ProducaoPorHoraOperadorWidget } from "@/features/operador/ProducaoPorHoraOperadorWidget";
import { EficienciaMaquinaWidget } from "@/features/operador/EficienciaMaquinaWidget";

import { use } from "react";
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { EyeIcon } from "lucide-react";

const colunasUsuario = [
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


export default function ProducaoOperadorPage({ params }) {
  const { id } = use(params);
  const operadorId = Number(id);

  const dadosExibidos = [
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


      <div className="w-full mt-8 pb-10 px-8 space-y-4">

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
            <ParadasComparadasOperadorWidget operadorId={operadorId} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <EficienciaMaquinaWidget operadorId={operadorId} />
          </div>
        </section>

        <section>
          <TableListagens
            /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
            data={dadosExibidos} columns={colunasUsuario}
            acoesDropdown={(usuario) => (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`ordemDeProducao/${usuario.op}`}>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      Ver OP relacionada
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