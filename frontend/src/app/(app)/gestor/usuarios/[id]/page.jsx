"use client"

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { EyeIcon, ChevronDown, Pencil, Trash2, Search } from "lucide-react";

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
import FilterDropdown from "@/components/ui/FilterDropdown";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import FormEdicaoOperadorGestor from "@/components/ui/forms/usuarios/formEdicaoOperadorGestor";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";

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
  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);
  const [buscaApontamento, setBuscaApontamento] = useState("");

  const dadosOriginais = [
    { id: 1, op: '0098', data: '26/03 (08:00 - 09:00)', duracao: '00:35', produzido: '15', refugo: '2', observacao: 'Troca de ferramenta' },
    { id: 2, op: '1234', data: '06/01 (09:30 - 10:15)', duracao: '00:45', produzido: '10', refugo: '5', observacao: 'Manutenção corretiva' },
    { id: 3, op: '5678', data: '13/09 (10:15 - 10:35)', duracao: '00:20', produzido: '20', refugo: '1', observacao: 'Ajuste de parâmetros' },
    { id: 4, op: '9012', data: '30/09 (11:00 - 12:00)', duracao: '01:00', produzido: '5', refugo: '8', observacao: 'Refugo elevado devido a falta de aquecimento' },
    { id: 5, op: '1223', data: '28/03 (12:00 - 14:00)', duracao: '01:00', produzido: '6', refugo: '8', observacao: 'Retirada de amostras para o laboratório de qualidade' },
    { id: 6, op: '1206', data: '30/07 (17:00 - 18:00)', duracao: '01:00', produzido: '13', refugo: '6', observacao: 'Finalização de OP' },
    { id: 7, op: '8912', data: '20/09 (16:00 - 19:00)', duracao: '01:00', produzido: '20', refugo: '5', observacao: 'Falta de material' },
    { id: 8, op: '0607', data: '20/09 (16:00 - 19:00)', duracao: '01:00', produzido: '20', refugo: '5', observacao: 'Boa qualidade' },
  ];

  useEffect(() => {
    setDadosApontamentoState(dadosOriginais);
  }, []);

  const opcoesOrdenacaoApontamento = [
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'OP Afetada Crescente', value: 'opAfetada_asc' },
    { label: 'OP Afetada Decrescente', value: 'opAfetada_desc' },
    { label: 'Produzido Crescente', value: 'produzido_asc' },
    { label: 'Produzido Decrescente', value: 'produzido_desc' },
    { label: 'Refugo Crescente', value: 'refugo_asc' },
    { label: 'Refugo Decrescente', value: 'refugo_desc' }
  ];

  //lógica de ordenação de Apontamentos
  const handleSortApontamento = (criterio) => {
    const dadosCopiados = [...dadosApontamentoState];

    dadosCopiados.sort((a, b) => {
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;

      if (criterio === 'opAfetada_asc') return Number(a.op) - Number(b.op);
      if (criterio === 'opAfetada_desc') return Number(b.op) - Number(a.op);

      if (criterio === 'produzido_asc') return a.produzido - b.produzido;
      if (criterio === 'produzido_desc') return b.produzido - a.produzido;

      if (criterio === 'refugo_asc') return a.refugo - b.refugo;
      if (criterio === 'refugo_desc') return b.refugo - a.refugo;

      return 0;
    });

    setDadosApontamentoState(dadosCopiados);
  };


  //filtros para apontamentos
  const apontamentoFilter = [
    { id: "data", label: "Data", type: "date-range" },
    { id: "produzido", label: "Produzido", type: "number-range" },
    { id: "refugo", label: "Refugo", type: "number-range" }
  ];

  const aplicarFiltrosApontamento = (filtrosSelecionados) => {
    let dadosFiltrados = [...dadosOriginais];

    if (filtrosSelecionados.produzido) {
      if (filtrosSelecionados.produzido.min != null) {
        dadosFiltrados = dadosFiltrados.filter(a =>
          Number(a.produzido) >= filtrosSelecionados.produzido.min
        );
      }

      if (filtrosSelecionados.produzido.max != null) {
        dadosFiltrados = dadosFiltrados.filter(a =>
          Number(a.produzido) <= filtrosSelecionados.produzido.max
        );
      }
    }

    if (filtrosSelecionados.refugo) {
      if (filtrosSelecionados.refugo.min != null) {
        dadosFiltrados = dadosFiltrados.filter(a =>
          Number(a.refugo) >= filtrosSelecionados.refugo.min
        );
      }

      if (filtrosSelecionados.refugo.max != null) {
        dadosFiltrados = dadosFiltrados.filter(a =>
          Number(a.refugo) <= filtrosSelecionados.refugo.max
        );
      }
    }

    setDadosApontamentoState(dadosFiltrados);
  };

  //filtra os dados atuais de APONTAMENTOS (filtrados e ordenados) pelo termo de busca
  const dadosApontamentosFiltrados = dadosApontamentoState.filter((a) => {
    const termo = buscaApontamento.toLowerCase();

    return (
      a.op.toLowerCase().includes(termo) ||
      String(a.id).includes(termo)
    );
  });

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full pb-10 p-8">
        <div className="w-full pb-10 space-y-4">
          <Link className="flex items-center" href="/gestor/usuarios">
            <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
            <p className="text-xl font-semibold text-gray-800">Voltar para Usuários </p>
          </Link>

          <section id="infos_user" className="flex flex-col">
            <div className="flex justify-between items-start">
              <div className="flex">
                <Image
                  src="/jose.svg"
                  alt="Demo Maquina"
                  className="rounded-xl"
                  width={250}
                  height={250}
                />

                <div className="flex flex-col ml-5">
                  <h1 className="text-3xl font-bold text-black">Nome: José Adamastor Alves da Silva Souza</h1>
                  <div className="flex gap-10">

                    <div className="flex flex-col gap-5 mt-2">
                      <div className="flex items-center">
                        <p className="text-xl font-semibold text-black mr-2">ID:</p>
                        <p className="text-xl font-medium text-black">00000</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-xl font-semibold text-black mr-2">Email:</p>
                        <p className="text-xl font-medium text-black">josezinho@gmail.com</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-xl font-semibold text-black mr-2">CPF:</p>
                        <p className="text-xl font-medium text-black">443.651.730-65</p>
                      </div>

                      <div className="flex items-center">
                        <p className="text-xl font-semibold text-black mr-2">Turno:</p>
                        <p className="text-xl font-medium text-black">Noite</p>
                      </div>
                    </div>


                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger className="text-[#122f60] cursor-pointer">
                    <Pencil size={36} className="mr-1" />
                  </DialogTrigger>
                  <DialogContent>
                    <FormEdicaoOperadorGestor />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger className="text-[#b30000] cursor-pointer">
                    <Trash2 className=" w-9 h-9" />
                  </DialogTrigger>
                  <DialogContent>
                    <FormExclusaoUsuario />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

          </section>

          <section id="maquina_responsavel" className="mt-5">
            <h1 className="font-bold text-3xl">Responsável por:</h1>
            <Link href="/gestor/maquinas/{maquina.id}" >
              <div className="bg-white w-full shadow-md border rounded-lg flex justify-between items-start p-8 mt-6">
                <div className="flex">
                  <Image src="/demo_maq.png" alt="Demo Maquina" className="rounded-lg" width={200} height={150} />
                  <div className="ml-8 flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-[#212e4b] uppercase">THAK-12345</h1>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">ID:</p>
                      <p className="text-xl font-medium text-black">00000</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Série:</p>
                      <p className="text-xl font-medium text-black">SX-900</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Data de Aquisição:</p>
                      <p className="text-xl font-medium text-black">01/01/2023</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Velocidade Média:</p>
                      <p className="text-xl font-medium text-black">40 peças/h</p>
                    </div>
                  </div>
                </div>

                <p className="rounded-xl px-3 text-[#b30000] font-semibold bg-red-100">Parada</p>
              </div>
            </Link>
          </section>

          {/* Gráficos */}
          <h1 className="font-bold text-3xl mt-8">Produção</h1>
          {/* <section className="bg-white border-2 rounded-2xl p-4 shadow-sm">
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
        </div> */}

          {/* Listagem de Apontamentos feito pelo Usuário */}
          <section id="listagem_apontamentos">

            <h1 className="text-3xl font-semibold mb-4">Histórico de Apontamentos Feitos pelo Usuário</h1>

            {/* Busca */}
            <div className="flex searchbar">
              <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
                <input
                  type="search"
                  className="p-2 w-full outline-none bg-transparent"
                  placeholder="Busque por id ou op afetada..."
                  value={buscaApontamento}
                  onChange={(e) => setBuscaApontamento(e.target.value)}
                />
                <button className="outline-none cursor-pointer mr-2"><Search /></button>
              </div>
            </div>

            <div className="row_ord_fil_cont flex items-center justify-between mt-2">
              <p>{dadosApontamentosFiltrados.length} apontamentos encontrados</p>

              <div className="flex items-center gap-4">
                <OrdenarDropdown
                  label="Ordenar por"
                  options={opcoesOrdenacaoApontamento}
                  onSortChange={handleSortApontamento}
                />

                <FilterDropdown
                  filtersConfig={apontamentoFilter}
                  onApply={aplicarFiltrosApontamento}
                />
              </div>
            </div>

            <div className="mt-4">
              {dadosApontamentosFiltrados.length > 0 ? (
                <TableListagens
                  /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
                  data={dadosApontamentosFiltrados}
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
              ) : (
                //caso não encontre nada correspondente
                <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                  <Search className="w-12 h-12 mb-4 text-gray-300" />
                  <h2 className="text-xl font-semibold">Nenhum apontamento encontrado</h2>
                  <p>Não encontramos nenhum apontamento com a busca ou filtro.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
