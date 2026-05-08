"use client"

import Header from "@/components/ui/topbar";
import { MotivoRefugoMaquinaWidget } from "@/features/maquinas/MotivoRefugoMaquinaWidget";
import { MotivoSetupMaquinaWidget } from "@/features/maquinas/MotivoSetupMaquinaWidget";
import { OEEMaquinaWidget } from "@/features/maquinas/OEEMaquinaWidget";
import { OEEEvolucaoMaquinaWidget } from "@/features/maquinas/OEEEvolucaoMaquinaWidget";
import { VelocidadeMaquinaWidget } from "@/features/maquinas/VelocidadeMaquinaWidget";

import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";

import { BellRing, Pencil, EyeIcon, ChevronDown, Trash2, Flame, Plus, Search } from "lucide-react";

import { use, useState, useEffect } from "react";
import Link from "next/link";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import FormExclusaoMaquina from "@/components/ui/forms/maquinas/formExclusaoMaquina";
import FormEdicaoMaquina from "@/components/ui/forms/maquinas/formEdicaoMaquina";
import Image from "next/image";
import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import ModalSucessNotificacao from "@/components/ui/forms/historicoEventos/modalSucessNotificacao";
import FormEdicaoEvento from "@/components/ui/forms/historicoEventos/formEdicaoEvento";


const colunasMaquina = [
  { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' }, /* id da máquina */
  {
    id: 'tipo',
    key: 'tipoEvento',
    label: 'Tipo',
    className: 'text-center justify-center',
    icone: (valor) => {
      const config = {
        "Setup": {
          variant: "outline",
          className: "!border-amber-300 !bg-amber-100 !text-amber-900 font-semibold text-sm dark:!border-amber-300/45 dark:!bg-amber-300/20 dark:!text-amber-100"
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
  { id: 'duracao', key: 'duracao', label: 'Duração' },
  { id: 'motivo', key: 'motivo', label: 'Motivo' },
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

const dadosOriginais = [
  { id: 1,  tipoEvento: 'Setup', data: '26/03 (08:00 - 09:00)', duracao: '00:35', motivo: 'Troca de ferramenta' },
  { id: 2,  tipoEvento: 'Parada', data: '06/01 (09:30 - 10:15)', duracao: '00:45', motivo: 'Manutenção corretiva' },
  { id: 3,  tipoEvento: 'Setup', data: '13/09 (10:15 - 10:35)', duracao: '00:20', motivo: 'Ajuste de parâmetros' },
  { id: 4,  tipoEvento: 'Parada', data: '30/09 (11:00 - 12:00)', duracao: '01:00', motivo: 'Falha elétrica' },
];

export default function MaquinaDetalhePage({ params }) {
  const { id } = use(params);
  const maquinaId = Number(id);
  const [dados, setDados] = useState([]);

  useEffect(() => {
    setDados(dadosOriginais);
  }, []);

  const [buscaEvento, setBuscaEvento] = useState("");
  const [buscaApontamento, setBuscaApontamento] = useState("");

  const parseData = (dataStr) => {
    const [dataParte] = dataStr.split(" ");
    const [dia, mes] = dataParte.split("/");

    // ano fixo (ajuste se precisar)
    return new Date(`2025-${mes}-${dia}`);
  };

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
  // -------------------------------------------------------------------------------------------------- Eventos --------------------------------------------------------------------------------------------------
  const opcoesOrdenacaoEventos = [
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'Data Crescente', value: 'data_asc' },
    { label: 'Data Decrescente', value: 'data_desc' },
    { label: 'Duração Crescente', value: 'duracao_asc' },
    { label: 'Duração Decrescente', value: 'duracao_desc' }
  ];

  //lógica de ordenação de Eventos
  const handleSortEventos = (criterio) => {
    const dadosCopiados = [...dados];

    dadosCopiados.sort((a, b) => {
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;

      if (criterio === 'data_asc') return parseData(a.data) - parseData(b.data);
      if (criterio === 'data_desc') return parseData(b.data) - parseData(a.data);

      if (criterio === 'duracao_asc') {
        const [hA, mA] = a.duracao.split(':').map(Number);
        const [hB, mB] = b.duracao.split(':').map(Number);
        return (hA * 60 + mA) - (hB * 60 + mB);
      }

      if (criterio === 'duracao_desc') {
        const [hA, mA] = a.duracao.split(':').map(Number);
        const [hB, mB] = b.duracao.split(':').map(Number);
        return (hB * 60 + mB) - (hA * 60 + mA);
      }

      return 0;
    });

    setDados(dadosCopiados);
  };


  //filtros para eventos
  const eventosFilter = [
    { id: "tipoEvento", label: "Tipo", type: "checkbox", options: ["Parada", "Setup"] },
    { id: "data", label: "Data", type: "date-range" },
    // {id:"duracao", label:"Duração", type:"time-max"} --> não funcionou, tentei de várias formas mas o filtro por duração não funcionou, então deixei comentado por enquanto. quem quiser tentar implementar depois, fique à vontade!
  ];

  const aplicarFiltrosEventos = (filtrosSelecionados) => {
    let dadosFiltrados = [...dadosOriginais];

    // filtro por status
    if (filtrosSelecionados.tipoEvento?.length) {
      dadosFiltrados = dadosFiltrados.filter(evento =>
        filtrosSelecionados.tipoEvento.includes(evento.tipoEvento)
      );
    }

    // filtro por data
    if (filtrosSelecionados.data) {
      if (filtrosSelecionados.data.start) {
        dadosFiltrados = dadosFiltrados.filter(evento =>
          parseData(evento.data) >= new Date(filtrosSelecionados.data.start)
        );
      }

      if (filtrosSelecionados.data.end) {
        dadosFiltrados = dadosFiltrados.filter(evento =>
          parseData(evento.data) <= new Date(filtrosSelecionados.data.end)
        );
      }
    }

    setDados(dadosFiltrados);
  };

  //filtra os dados atuais de EVENTOS (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dados.filter((evento) => {
    const termo = buscaEvento.toLowerCase();

    return (
      (evento.status?.toLowerCase() || "").includes(termo) ||
      evento.id?.toString().includes(termo)
    );
  });

  // -------------------------------------------------------------------------------------------------- Apontamentos  --------------------------------------------------------------------------------------------------
  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);
  useEffect(() => {
    setDados(dadosOriginais);
    setDadosApontamentoState(dadosApontamento);
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
    let dadosFiltrados = [...dadosApontamento];

    //filtro por produzido
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

    //filtro por refugo
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

    //filtro por data
    if (filtrosSelecionados.data) {
      if (filtrosSelecionados.data.start) {
        dadosFiltrados = dadosFiltrados.filter(a =>
          parseData(a.data) >= new Date(filtrosSelecionados.data.start)
        );
      }

      if (filtrosSelecionados.data.end) {
        dadosFiltrados = dadosFiltrados.filter(a =>
          parseData(a.data) <= new Date(filtrosSelecionados.data.end)
        );
      }
    }

    setDadosApontamentoState(dadosFiltrados);
  };

  //filtra os dados atuais de APONTAMENTOS (filtrados e ordenados) pelo termo de busca
  const dadosApontamentosFiltrados = dadosApontamentoState.filter((a) => {
    const termo = buscaApontamento.toLowerCase();

    return (
      (a.op?.toLowerCase() || "").includes(termo) ||
      a.id?.toString().includes(termo)
    );
  });


  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full mt-8 pb-10 px-8 space-y-4">

        <Link className="flex items-center" href="/adm/maquinas">
          <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
          <p className="text-xl font-semibold text-gray-800">Voltar para Máquinas </p>
        </Link>

        <section id="infos_op" className="flex flex-col">
          <div className="flex justify-between items-center">
            <div className="bg-white px-5 pb-3 rounded-tl-4xl rounded-tr-4xl border border-t-gray-300 border-l-gray-300 border-r-gray-300 border-b-8 border-b-[#00357a]">
              <h1 className="text-3xl font-bold uppercase text-[#212e4b] pb-0 inline-block px-6 py-4">
                THAK-1234
              </h1>
            </div>

            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger className="text-[#122f60] cursor-pointer">
                  <Pencil size={36} className="mr-1" />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoMaquina />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="text-[#b30000] cursor-pointer">
                  <Trash2 className=" w-9 h-9" />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoMaquina />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex gap-8 mt-5">
            <div className="bg-white rounded-xl p-13  ">
              <Image src="/demo_maq.png" alt="Demo Maquina" className="rounded-xl" width={150} height={150} />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">ID:</p>
                <p className="text-xl font-medium text-black">00000</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Série:</p>
                <p className="text-xl font-medium text-black">SX-900</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">ID:</p>
                <p className="text-xl font-medium text-black">00000</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Status:</p>
                <p className="rounded-xl px-3 text-[#b30000] font-semibold bg-red-100">Parada</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Operador:</p>
                <p className="text-xl font-medium text-black">Estevão Ferreira</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Data de Aquisição:</p>
                <p className="text-xl font-medium text-black">13/09/2025</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Velocidade Média:</p>
                <p className="text-xl font-medium text-black">40 peças/h</p>
              </div>

            </div>
          </div>
        </section>


        {/* Gráficos */}
        <h1 className="font-bold text-3xl mt-5">Produção</h1>
        {/* SEÇÃO 1: Refugo + Setup */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <MotivoRefugoMaquinaWidget maquinaId={maquinaId} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <MotivoSetupMaquinaWidget maquinaId={maquinaId} />
          </div>
        </section>

        {/* SEÇÃO 2: OEE Gauges */}
        <section className="bg-white border-2 rounded-2xl p-4 shadow-sm">
          <OEEMaquinaWidget maquinaId={maquinaId} />
        </section>

        {/* SEÇÃO 3: Evolução OEE + Velocidade */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <OEEEvolucaoMaquinaWidget maquinaId={maquinaId} />
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <VelocidadeMaquinaWidget maquinaId={maquinaId} />
          </div>
        </section>

        {/* Listagem */}
        {/* Listagem de Eventos */}
        <section id="listagem_eventos">
          <div>
            <div className="flex items-center justify-between gap-5 mt-8 mb-8">
              <h1 className="text-4xl font-semibold">Histórico de Eventos da Máquina</h1>
              <Dialog>
                <DialogTrigger className="cursor-pointer bg-blue-900 flex items-center px-4 py-2 rounded-md text-white font-semibold text-2xl gap-2">
                  <Plus size={28} className="text-white cursor-pointer" />
                  Cadastrar
                </DialogTrigger>
                <DialogContent>
                  <FormCadastroEvento />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Busca */}
          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none bg-transparent"
                placeholder="Busque por nome ou id..."
                value={buscaEvento}
                onChange={(e) => setBuscaEvento(e.target.value)}
              />
              <button className="outline-none cursor-pointer mr-2"><Search /></button>
            </div>
          </div>

          <div className="row_ord_fil_cont flex items-center justify-between mt-3">
            <p>{dadosExibidos.length} eventos encontrados</p>

            <div className="flex items-center gap-4 mb-3">
              <OrdenarDropdown
                label="Ordenar por"
                options={opcoesOrdenacaoEventos}
                onSortChange={handleSortEventos}
              />

              <FilterDropdown
                filtersConfig={eventosFilter}
                onApply={aplicarFiltrosEventos}
              />
            </div>
          </div>

          <div>
            <TableListagens
              /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
              data={dadosExibidos} columns={colunasMaquina}
              acoesDropdown={(maquina) => (
                <>
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
          </div>

          {/* Listagem de Apontamentos */}
          <div>
            <h1 className="text-4xl font-semibold mb-3">Histórico de Apontamentos da Máquina</h1>

            {/* Busca */}
            <div className="flex searchbar">
              <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
                <input
                  type="search"
                  className="p-2 w-full outline-none bg-transparent"
                  placeholder="Busque por nome ou id..."
                  value={buscaApontamento}
                  onChange={(e) => setBuscaApontamento(e.target.value)}
                />
                <button className="outline-none cursor-pointer mr-2"><Search /></button>
              </div>
            </div>

            <div className="row_ord_fil_cont flex items-center justify-between mt-3">
              <p>{dadosApontamentosFiltrados.length} apontamentos encontrados</p>

              <div className="flex items-center gap-4 mb-3">
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
            <TableListagens
              /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
              data={dadosApontamentosFiltrados} columns={colunasApontamento}
              acoesDropdown={(apontamento) => (
                <>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/adm/ordemDeProducao/${apontamento.op}`}>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      Ver OP relacionada
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            />
          </div>
        </section >

      </div >

    </main >
  );
}
