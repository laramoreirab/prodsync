"use client";
import { use, useState } from "react";
import { useEventos } from "@/hooks/useEventos";

import TableListagens from "@/components/table";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";
import { DataEvento } from "@/components/ui/dataEvento";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Pencil, Plus, Flame, Search, EyeIcon } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { OPProgressoWidget } from "@/features/ordens/OPProgressoWidget";
import { OPOEEDetalheWidget } from "@/features/ordens/OPOEEDetalheWidget";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEvento";
import FormCriarApontamento from "@/components/ui/forms/maquinas/criarApontamento";
import FormJustificativaEvento from "@/components/ui/forms/historicoEventos/formJustificativaEvento";
import Link from "next/link";
import Image from "next/image";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";

export default function OPDetalhePage({ params }) {
  const { id } = use(params);
  const opId = id;

  const { eventos, loading, error } = useEventos();

  // ------------------------------------ Eventos ------------------------------------

  const [buscaEvento, setBuscaEvento] = useState("");
  const [eventosOrdenados, setEventosOrdenados] = useState(null); // null = usa o original
  const [eventosFiltrados, setEventosFiltrados] = useState(null); // null = usa o original

  const dadosEventosBase = eventosFiltrados ?? eventos;
  const dadosEventosExibidos = (eventosOrdenados ?? dadosEventosBase)
    .filter((evento) => {
      const termo = buscaEvento.toLowerCase();
      return (
        evento.tipo?.toLowerCase().includes(termo) ||
        evento.id?.toString().includes(termo)
      );
    });

  const colunasOP = [
    { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' },
    {
      id: 'tipo',
      key: 'tipo',
      label: 'Status',
      className: 'text-center justify-center',
      icone: (valor) => {
        const config = {
          "Setup": { variant: "secondary", className: "bg-[#fffbea] text-amarelo font-semibold text-sm" },
          "Parada": { variant: "destructive", className: "font-semibold text-sm border-none" }
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
      icone: (valor, row) => <DataEvento inicio={row.inicio} fim={row.fim} />
    },
    {
      id: 'duracao',
      key: 'duracao',
      label: 'Duração',
      icone: (valor, row) => <DuracaoEvento inicio={row.inicio} fim={row.fim} />
    },
    { id: 'motivo', key: 'motivo', label: 'Motivo' },
    { id: 'observacao', key: 'observacao', label: 'Observação' }
  ];

  const opcoesOrdenacaoEventos = [
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'Data Crescente', value: 'data_asc' },
    { label: 'Data Decrescente', value: 'data_desc' },
  ];

  const handleSortEventos = (criterio) => {
    const copia = [...dadosEventosBase];
    copia.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;
      if (criterio === "data_asc") return new Date(a.inicio) - new Date(b.inicio);
      if (criterio === "data_desc") return new Date(b.inicio) - new Date(a.inicio);
      return 0;
    });
    setEventosOrdenados(copia);
  };

  const eventosFilter = [
    { id: "tipo", label: "Tipo", type: "checkbox", options: ["Parada", "Setup"] },
    { id: "data", label: "Data", type: "date-range" },
  ];

  const aplicarFiltrosEventos = (filtrosSelecionados) => {
    let dadosFiltrados = [...eventos];

    if (filtrosSelecionados.tipo?.length) {
      dadosFiltrados = dadosFiltrados.filter((e) =>
        filtrosSelecionados.tipo.includes(e.tipo)
      );
    }

    if (filtrosSelecionados.data?.start) {
      dadosFiltrados = dadosFiltrados.filter(
        (e) => new Date(e.inicio) >= new Date(filtrosSelecionados.data.start)
      );
    }

    if (filtrosSelecionados.data?.end) {
      dadosFiltrados = dadosFiltrados.filter(
        (e) => new Date(e.inicio) <= new Date(filtrosSelecionados.data.end)
      );
    }

    setEventosFiltrados(dadosFiltrados);
    setEventosOrdenados(null); // reseta ordenação ao filtrar
  };

  // ------------------------------------ Apontamentos ------------------------------------

  const dadosApontamento = [
    { id: 1, op: '0098', data: '26/03 (08:00 - 09:00)', produzido: '15', refugo: '2', observacao: 'Troca de ferramenta' },
    { id: 2, op: '1234', data: '06/01 (09:30 - 10:15)', produzido: '10', refugo: '5', observacao: 'Manutenção corretiva' },
    { id: 3, op: '5678', data: '13/09 (10:15 - 10:35)', produzido: '20', refugo: '1', observacao: 'Ajuste de parâmetros' },
    { id: 4, op: '9012', data: '30/09 (11:00 - 12:00)', produzido: '5', refugo: '8', observacao: 'Refugo elevado devido a falta de aquecimento' },
    { id: 5, op: '1223', data: '28/03 (12:00 - 14:00)', produzido: '6', refugo: '8', observacao: 'Retirada de amostras para o laboratório de qualidade' },
    { id: 6, op: '1206', data: '30/07 (17:00 - 18:00)', produzido: '13', refugo: '6', observacao: 'Finalização de OP' },
    { id: 7, op: '8912', data: '20/09 (16:00 - 19:00)', produzido: '20', refugo: '5', observacao: 'Falta de material' },
    { id: 8, op: '0607', data: '20/09 (16:00 - 19:00)', produzido: '20', refugo: '5', observacao: 'Boa qualidade' },
  ];

  const [dadosApontamentoState, setDadosApontamentoState] = useState(dadosApontamento);
  const [buscaApontamento, setBuscaApontamento] = useState("");

  const colunasApontamento = [
    { id: 'id', key: 'id', label: 'ID', className: 'w-20 text-center justify-center' },
    { id: 'data', key: 'data', label: 'Data (Início - Fim)' },
    {
      id: 'produzido', key: 'produzido', label: 'Produzido', className: 'text-center justify-center',
      icone: (valor) => (
        <Badge variant="outline" className="bg-green-500/15 text-green-600 text-sm font-semibold border-none">
          {valor}
        </Badge>
      )
    },
    {
      id: 'refugo', key: 'refugo', label: 'Refugo', className: 'text-center justify-center',
      icone: (valor) => (
        <Badge variant="destructive" className="font-semibold text-sm border-none">
          {valor}
        </Badge>
      )
    },
    { id: 'observacao', key: 'observacao', label: 'Observação' },
  ];

  const opcoesOrdenacaoApontamento = [
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'Produzido Crescente', value: 'produzido_asc' },
    { label: 'Produzido Decrescente', value: 'produzido_desc' },
    { label: 'Refugo Crescente', value: 'refugo_asc' },
    { label: 'Refugo Decrescente', value: 'refugo_desc' }
  ];

  const handleSortApontamento = (criterio) => {
    const copia = [...dadosApontamentoState];
    copia.sort((a, b) => {
      if (criterio === 'id_asc') return a.id - b.id;
      if (criterio === 'id_desc') return b.id - a.id;
      if (criterio === 'produzido_asc') return Number(a.produzido) - Number(b.produzido);
      if (criterio === 'produzido_desc') return Number(b.produzido) - Number(a.produzido);
      if (criterio === 'refugo_asc') return Number(a.refugo) - Number(b.refugo);
      if (criterio === 'refugo_desc') return Number(b.refugo) - Number(a.refugo);
      return 0;
    });
    setDadosApontamentoState(copia);
  };

  const apontamentoFilter = [
    { id: "produzido", label: "Produzido", type: "number-range" },
    { id: "refugo", label: "Refugo", type: "number-range" }
  ];

  const aplicarFiltrosApontamento = (filtrosSelecionados) => {
    let dadosFiltrados = [...dadosApontamento];

    if (filtrosSelecionados.produzido?.min != null) {
      dadosFiltrados = dadosFiltrados.filter(a => Number(a.produzido) >= filtrosSelecionados.produzido.min);
    }
    if (filtrosSelecionados.produzido?.max != null) {
      dadosFiltrados = dadosFiltrados.filter(a => Number(a.produzido) <= filtrosSelecionados.produzido.max);
    }
    if (filtrosSelecionados.refugo?.min != null) {
      dadosFiltrados = dadosFiltrados.filter(a => Number(a.refugo) >= filtrosSelecionados.refugo.min);
    }
    if (filtrosSelecionados.refugo?.max != null) {
      dadosFiltrados = dadosFiltrados.filter(a => Number(a.refugo) <= filtrosSelecionados.refugo.max);
    }

    setDadosApontamentoState(dadosFiltrados);
  };

  const dadosApontamentosFiltrados = dadosApontamentoState.filter((a) => {
    const termo = buscaApontamento.toLowerCase();
    return (
      (a.op?.toLowerCase() || "").includes(termo) ||
      a.id?.toString().includes(termo)
    );
  });

  // ------------------------------------ Render ------------------------------------

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full mt-8 pb-10 px-8 space-y-4">

        <Link className="flex items-center" href="/operador/ordensDeProducao">
          <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
          <p className="text-xl font-semibold text-gray-800">Voltar para Ordens de Produção</p>
        </Link>

        <div className="flex justify-between">
          <h1 className="text-4xl font-bold">Ordem de Produção #AAA550</h1>
          <div className="flex flex-col items-center gap-3">
            <Dialog>
              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                <Plus className="mr-2" />
                Criar Apontamento
              </DialogTrigger>
              <DialogContent>
                <FormCriarApontamento />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger className="bg-[#7d95c6] px-7 py-1 rounded-md flex items-center text-white text-xl font-semibold cursor-pointer">
                <Pencil className="mr-2" />
                Justificar Evento
              </DialogTrigger>
              <DialogContent>
                <FormJustificativaEvento />
              </DialogContent>
            </Dialog>
          </div>
        </div>

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
                <div className="py-3 font-semibold text-gray-900 text-2xl">
                  <div className="flex flex-col gap-5">
                    <p>
                      Status:
                      <Badge variant="outline" className="bg-green-500/15 text-green-600 text-sm font-semibold border-none ml-2">Produzindo</Badge>
                    </p>
                    <p>
                      Prioridade:
                      <Badge variant="outline" className="ml-2 border border-vermelho-vivido bg-transparent text-black text-sm font-medium">
                        <Flame className="text-vermelho-vivido" />Crítica
                      </Badge>
                    </p>
                    <div className="flex">
                      <p>Início:</p>
                      <p className="text-2xl font-medium ml-2">26/03/2024 08:00</p>
                    </div>
                    <div className="flex">
                      <p>Prazo Final:</p>
                      <p className="text-2xl font-medium ml-2">26/03/2024 18:00</p>
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
        <section className="bg-white border rounded-xl p-6 shadow-sm mb-13">
          <OPOEEDetalheWidget opId={opId} />
        </section>

        {/* Listagem de Eventos */}
        <section id="listagem_histEventos" className="mb-20">
          <h1 className="text-3xl font-semibold mb-5">Histórico de Eventos da OP</h1>

          <div className="flex searchbar">
            <div className="flex items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none font-medium bg-transparent"
                placeholder="Busque por id ou tipo de evento..."
                value={buscaEvento}
                onChange={(e) => setBuscaEvento(e.target.value)}
              />
              <button className="outline-none cursor-pointer mr-2"><Search /></button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p>{dadosEventosExibidos.length} eventos encontrados</p>
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

          {loading ? (
            <p className="text-gray-500 text-center py-8">Carregando eventos...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-8">{error}</p>
          ) : dadosEventosExibidos.length > 0 ? (
            <TableListagens
              data={dadosEventosExibidos}
              columns={colunasOP}
              acoesDropdown={(evento) => (
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <EyeIcon strokeWidth={2} className="mr-1 h-4 w-4 text-primary" />
                      Ver Detalhes
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DetalhesEvento eventoId={evento.id} />
                  </DialogContent>
                </Dialog>
              )}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-500">Nenhum evento encontrado</h2>
              <p>Não encontramos nenhum evento com esse termo ou filtro.</p>
            </div>
          )}
        </section>

        {/* Listagem de Apontamentos */}
        <section id="listagem_histApontamentos">
          <h1 className="text-3xl font-semibold mb-5">Histórico de Apontamentos da OP</h1>

          <div className="flex searchbar">
            <div className="flex items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none font-medium bg-transparent"
                placeholder="Busque por id..."
                value={buscaApontamento}
                onChange={(e) => setBuscaApontamento(e.target.value)}
              />
              <button className="outline-none cursor-pointer mr-2"><Search /></button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
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

          {dadosApontamentosFiltrados.length > 0 ? (
            <TableListagens
              data={dadosApontamentosFiltrados}
              columns={colunasApontamento}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-500">Nenhum apontamento encontrado</h2>
              <p>Não encontramos nenhum apontamento com esse termo ou filtro.</p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}