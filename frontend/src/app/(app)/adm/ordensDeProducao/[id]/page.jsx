
"use client";
import { use, useState, useEffect } from "react";
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { BellRing, Pencil, ChevronDown, Trash2, Flame, Plus, Search } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import Link from "next/link"; import Image from "next/image";
import { OPProgressoWidget } from "@/features/ordens/OPProgressoWidget";
import { OPOEEDetalheWidget } from "@/features/ordens/OPOEEDetalheWidget";
import FormExclusaoOp from "@/components/ui/forms/ops/formExclusaoOp";
import FormEdicaoOp from "@/components/ui/forms/ops/formEdicaoOp";
import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
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
  { id: 'duracao', key: 'duracao', label: 'Duração', className: 'text-center justify-center' },
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
  const { id } = use(params);
  const opId = id;


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

  const [dadosEventos, setDadosEventos] = useState(dadosOP);
  const [buscaEvento, setBuscaEvento] = useState("");
  const [buscaApontamento, setBuscaApontamento] = useState("");


  const parseData = (dataStr) => {
    const [dataParte] = dataStr.split(" ");
    const [dia, mes] = dataParte.split("/");

    // ano fixo (ajuste se precisar)
    return new Date(`2025-${mes}-${dia}`);
  };

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
    const copia = [...dadosEventos];

    copia.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;

      if (criterio === "data_asc") return parseData(a.data) - parseData(b.data);
      if (criterio === "data_desc") return parseData(b.data) - parseData(a.data);

      if (criterio === "duracao_asc") {
        const [hA, mA] = a.duracao.split(":").map(Number);
        const [hB, mB] = b.duracao.split(":").map(Number);
        return hA * 60 + mA - (hB * 60 + mB);
      }

      if (criterio === "duracao_desc") {
        const [hA, mA] = a.duracao.split(":").map(Number);
        const [hB, mB] = b.duracao.split(":").map(Number);
        return hB * 60 + mB - (hA * 60 + mA);
      }

      return 0;
    });

    setDadosEventos(copia);
  };

  //filtros para eventos
  const eventosFilter = [
    { id: "evento", label: "Tipo", type: "checkbox", options: ["Parada", "Setup"] },
    { id: "data", label: "Data", type: "date-range" },
    // {id:"duracao", label:"Duração", type:"time-max"} --> não funcionou, tentei de várias formas mas o filtro por duração não funcionou, então deixei comentado por enquanto. quem quiser tentar implementar depois, fique à vontade!
  ];


  const aplicarFiltrosEventos = (filtrosSelecionados) => {
    let dadosFiltrados = [...dadosOP];

    if (filtrosSelecionados.evento?.length) {
      dadosFiltrados = dadosFiltrados.filter((e) =>
        filtrosSelecionados.evento.includes(e.evento)
      );
    }

    if (filtrosSelecionados.data) {
      if (filtrosSelecionados.data.start) {
        dadosFiltrados = dadosFiltrados.filter(
          (e) => parseData(e.data) >= new Date(filtrosSelecionados.data.start)
        );
      }

      if (filtrosSelecionados.data.end) {
        dadosFiltrados = dadosFiltrados.filter(
          (e) => parseData(e.data) <= new Date(filtrosSelecionados.data.end)
        );
      }
    }

    setDadosEventos(dadosFiltrados);
  };

  //filtra os dados atuais de EVENTOS (filtrados e ordenados) pelo termo de busca
  const dadosExibidos = dadosEventos
    .filter((evento) => {
      const termo = buscaEvento.toLowerCase();

      return (
        evento.evento?.toLowerCase().includes(termo) ||
        evento.motivo?.toLowerCase().includes(termo) ||
        evento.id?.toString().includes(termo)
      );
    });

  // -------------------------------------------------------------------------------------------------- Apontamentos  --------------------------------------------------------------------------------------------------
  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);

  useEffect(() => {
    setDadosApontamentoState(dadosApontamento);
  }, []);

  const opcoesOrdenacaoApontamento = [
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
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
    let dadosFiltrados = [...dadosApontamentoState];

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

  const colunasApontamento = [
    { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' },
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
    <>
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
        <div className="w-full mt-8 pb-10 px-8 space-y-4">


          <Link className="flex items-center" href="/adm/ordensDeProducao">
            <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
            <p className="text-xl font-semibold text-gray-800">Voltar para Ordens de Produção </p>
          </Link>

          <section id="infos_op" className="flex flex-col">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">Ordem de Produção #AAA550 </h1>

              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger className="text-[#122f60] cursor-pointer">
                    <Pencil size={36} className="mr-1" />
                  </DialogTrigger>
                  <DialogContent>
                    <FormEdicaoOp />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger className="text-[#b30000] cursor-pointer">
                    <Trash2 className=" w-9 h-9" />
                  </DialogTrigger>
                  <DialogContent>
                    <FormExclusaoOp />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>

          {/* SEÇÃO 1: Info card + Progresso */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <div className="flex gap-2 bg-white border rounded-xl shadow-sm w-1/4.7 flex-col items-center justify-center text-center font-bold p-8 mr-4">
                    <Image src="/demo_maq.png" className="rounded-lg" alt="Máquina" width={150} height={150} />
                    <p className="text-2xl">THAK-90334</p>
                    <p className="text-[#7c7c81] text-2xl font-semibold">Meta: 300 peças</p>
                  </div>

                  <div>
                    <div className="py-3 font-semibold text-gray-900 text-2xl">
                      <div className="flex flex-col gap-3">
                        <p>
                          Setor:
                          <Link href="/adm/setores/1" className="font-medium hover:underline ml-2">
                            Rosca
                          </Link>
                        </p>

                        <p>
                          Status:
                          <Badge variant="outline" className="bg-green-500/15 text-green-600 text-sm font-semibold border-none ml-2">Produzindo</Badge>
                        </p>

                        <p>
                          Prioridade:
                          <Badge variant="outline" className="ml-2 border border-vermelho-vivido bg-transparent text-black text-sm font-medium"><Flame className="text-vermelho-vivido" />Crítica</Badge>
                        </p>

                        <div className="flex">Operador:
                          <Link href="/adm/usuarios/1" className="font-medium hover:underline ml-2">
                            João Silva
                          </Link>
                        </div>

                        <div className="flex">
                          <p>Início:</p>
                          <p id="" className="text-2xl font-medium ml-2">
                            26/03/2024 08:00
                          </p>
                        </div>

                        <div className="flex">
                          <p>Prazo Final:</p>
                          <p id="" className="text-2xl font-medium ml-2">
                            26/03/2024 18:00
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm">
                <OPProgressoWidget opId={opId} />
              </div>
            </div>
          </section>

          {/* SEÇÃO 2: OEE Gauges */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <OPOEEDetalheWidget opId={opId} />
          </section>

          {/* Listagens */}
          {/* Listagem de Hist. Eventos da OP */}
          <section id="listagem_histEventos">
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

            {/* Tabela */}
            <TableListagens
              /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
              data={dadosExibidos}
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
                    <DialogContent>
                      <ModalSucessNotificacao  />
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


          {/* Listagem de Hist. Apontamentos da OP  */}
          <section id="listagem_histApontamentos">
            <div className="flex items-center justify-between gap-5 mt-5">
              <h1 className="text-4xl w-[125] font-semibold">Histórico de Apontamentos da OP</h1>
            </div>
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

            {/* Tabela */}
            <div>
              <TableListagens
                /* Dados e colunas a depender da página [no momento está estático definido em um json, posteriormente será um get]  */
                data={dadosApontamentosFiltrados}
                columns={colunasApontamento}
              />

            </div>
          </section>
        </div>
      </main>
    </>
  )
};