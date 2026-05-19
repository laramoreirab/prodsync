"use client";

import { MetaProducaoWidget } from "@/features/operador/MetaProducaoWidget";
import { TempoParadoTempoProduzindoOperadorWidget } from "@/features/operador/TempoParadoTempoProduzindoOperadorWidget";
import { OEEOperadorWidget } from "@/features/operador/OEEOperadorWidget";
import { PecasPorDiaWidget } from "@/features/operador/PecasPorDiaWidget";
import { ProducaoPorHoraOperadorWidget } from "@/features/operador/ProducaoPorHoraOperadorWidget";
import { EficienciaMaquinaWidget } from "@/features/operador/EficienciaMaquinaWidget";
import { use, useState, useEffect, useCallback } from "react";
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";
import { DataEvento } from "@/components/ui/dataEvento";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { EyeIcon, Pencil, Trash2, ChevronDown, Search, Plus, BellRing, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import FormEdicaoUsuario from "@/components/ui/forms/usuarios/formEdicaoUsuario";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";
import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
import FormEdicaoEvento from "@/components/ui/forms/historicoEventos/formEdicaoEvento";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEvento";
import ModalSucessNotificacao from "@/components/ui/forms/historicoEventos/modalSucessNotificacao";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { usuariosCrudService } from "@/services/usuariosCrudService";
import { apiFetch } from "@/lib/api";

const colunasEventos = [
  { id: "id", key: "id", label: "ID", className: "w-20 text-center justify-center" },
  {
    id: "tipo",
    key: "tipoEvento",
    label: "Tipo",
    className: "text-center justify-center",
    icone: (valor) => {
      const config = {
        Setup: {
          variant: "outline",
          className:
            "!border-amber-300 !bg-amber-100 !text-amber-900 font-semibold text-sm dark:!border-amber-300/45 dark:!bg-amber-300/20 dark:!text-amber-100",
        },
        Parada: {
          variant: "destructive",
          className: "font-semibold text-sm border-none",
        },
      };
      const estilo = config[valor] || { variant: "outline", className: "" };
      return (
        <Badge variant={estilo.variant} className={`whitespace-nowrap ${estilo.className}`}>
          {valor}
        </Badge>
      );
    },
  },
  {
    id: "data",
    key: "data",
    label: "Data (Início - Fim)",
    icone: (valor, row) => <DataEvento inicio={row.inicio} fim={row.fim} />,
  },
  {
    id: "duracao",
    key: "duracao",
    label: "Duração",
    icone: (valor, row) => <DuracaoEvento inicio={row.inicio} fim={row.fim} />,
  },
  { id: "motivo", key: "motivo", label: "Motivo" },
  { id: "observacao", key: "observacao", label: "Observação" },
];

const colunasApontamento = [
  { id: "id", key: "id", label: "ID", className: "w-20 text-center justify-center" },
  { id: "op", key: "op", label: "OP Afetada", className: "w-30 text-center justify-center pl-5" },
  {
    id: "data",
    key: "data",
    label: "Data (Início - Fim)",
    className: "pl-10",
    icone: (valor, row) => <DataEvento inicio={row.inicio} fim={row.fim} />,
  },
  {
    id: "produzido",
    key: "produzido",
    label: "Produzido",
    className: "text-center justify-center",
    icone: (valor) => (
      <Badge variant="outline" className="bg-green-500/15 text-green-600 text-sm font-semibold border-none">
        {valor}
      </Badge>
    ),
  },
  {
    id: "refugo",
    key: "refugo",
    label: "Refugo",
    className: "text-center justify-center",
    icone: (valor) => (
      <Badge variant="destructive" className="font-semibold text-sm border-none">
        {valor}
      </Badge>
    ),
  },
  { id: "observacao", key: "observacao", label: "Observação" },
];

const formatarPeriodo = (inicio, fim) => {
  if (!inicio) return "-";
  const ini = new Date(inicio);
  const textoIni = `${ini.toLocaleDateString("pt-BR")} (${ini.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  if (!fim) return `${textoIni})`;
  const end = new Date(fim);
  return `${textoIni} - ${end.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })})`;
};

const formatarDuracao = (minutos) => {
  const total = Number(minutos) || 0;
  const horas = Math.floor(total / 60);
  const mins = Math.round(total % 60);
  return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

export default function UsuarioDetalhePage({ params }) {
  const { id } = use(params);
  const operadorId = Number(id);

  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [dadosEventos, setDadosEventos] = useState([]);
  const [todosEventos, setTodosEventos] = useState([]);
  const [buscaEvento, setBuscaEvento] = useState("");

  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);
  const [todosApontamentos, setTodosApontamentos] = useState([]);
  const [buscaApontamento, setBuscaApontamento] = useState("");

  const parseData = (dataStr) => {
    if (!dataStr) return new Date(0);
    if (dataStr instanceof Date) return dataStr;
    const [dataParte] = String(dataStr).split(" ");
    const [dia, mes] = dataParte.split("/");
    return new Date(`2025-${mes}-${dia}`);
  };

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const [usuarioDados, historicoResp, apontamentosResp] = await Promise.all([
        usuariosCrudService.getById(operadorId),
        apiFetch(`/api/usuarios/${operadorId}/historico-eventos`, { method: "GET" }),
        apiFetch(`/api/usuarios/${operadorId}/apontamentos`, { method: "GET" }),
      ]);

      setUsuario(usuarioDados);

      const eventos = (historicoResp.dados || []).map((item) => ({
        ...item,
        tipoEvento: item.tipo,
        data: formatarPeriodo(item.inicio, item.fim),
        duracao: formatarDuracao(item.duracao_minutos),
        motivo: item.motivo || "-",
        observacao: item.observacao || "-",
      }));

      const apontamentos = (apontamentosResp.dados || []).map((item) => ({
        ...item,
        data: item.inicio ? formatarPeriodo(item.inicio, item.fim) : item.data,
      }));

      setTodosEventos(eventos);
      setDadosEventos(eventos);
      setTodosApontamentos(apontamentos);
      setDadosApontamentoState(apontamentos);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setCarregando(false);
    }
  }, [operadorId]);

  useEffect(() => {
    if (operadorId) carregarDados();
  }, [operadorId, carregarDados]);

  const opcoesOrdenacaoEventos = [
    { label: "ID Crescente", value: "id_asc" },
    { label: "ID Decrescente", value: "id_desc" },
    { label: "Data Crescente", value: "data_asc" },
    { label: "Data Decrescente", value: "data_desc" },
    { label: "Duração Crescente", value: "duracao_asc" },
    { label: "Duração Decrescente", value: "duracao_desc" },
  ];

  const handleSortEventos = (criterio) => {
    const dadosCopiados = [...dadosEventos];
    dadosCopiados.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;
      if (criterio === "data_asc") return new Date(a.inicio) - new Date(b.inicio);
      if (criterio === "data_desc") return new Date(b.inicio) - new Date(a.inicio);
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
    setDadosEventos(dadosCopiados);
  };

  const eventosFilter = [
    { id: "tipoEvento", label: "Tipo", type: "checkbox", options: ["Parada", "Setup"] },
    { id: "data", label: "Data", type: "date-range" },
  ];

  const aplicarFiltrosEventos = (filtrosSelecionados) => {
    let dadosFiltrados = [...todosEventos];
    if (filtrosSelecionados.tipoEvento?.length) {
      dadosFiltrados = dadosFiltrados.filter((evento) =>
        filtrosSelecionados.tipoEvento.includes(evento.tipoEvento)
      );
    }
    if (filtrosSelecionados.data?.start) {
      dadosFiltrados = dadosFiltrados.filter(
        (evento) => new Date(evento.inicio) >= new Date(filtrosSelecionados.data.start)
      );
    }
    if (filtrosSelecionados.data?.end) {
      dadosFiltrados = dadosFiltrados.filter(
        (evento) => new Date(evento.inicio) <= new Date(filtrosSelecionados.data.end)
      );
    }
    setDadosEventos(dadosFiltrados);
  };

  const dadosEventosExibidos = dadosEventos.filter((evento) => {
    const termo = buscaEvento.toLowerCase();
    return (
      (evento.tipoEvento?.toLowerCase() || "").includes(termo) ||
      (evento.motivo?.toLowerCase() || "").includes(termo) ||
      String(evento.id).includes(termo)
    );
  });

  const opcoesOrdenacaoApontamento = [
    { label: "ID Crescente", value: "id_asc" },
    { label: "ID Decrescente", value: "id_desc" },
    { label: "OP Afetada Crescente", value: "opAfetada_asc" },
    { label: "OP Afetada Decrescente", value: "opAfetada_desc" },
    { label: "Produzido Crescente", value: "produzido_asc" },
    { label: "Produzido Decrescente", value: "produzido_desc" },
    { label: "Refugo Crescente", value: "refugo_asc" },
    { label: "Refugo Decrescente", value: "refugo_desc" },
  ];

  const handleSortApontamento = (criterio) => {
    const dadosCopiados = [...dadosApontamentoState];
    dadosCopiados.sort((a, b) => {
      if (criterio === "id_asc") return a.id - b.id;
      if (criterio === "id_desc") return b.id - a.id;
      if (criterio === "opAfetada_asc") return String(a.op).localeCompare(String(b.op));
      if (criterio === "opAfetada_desc") return String(b.op).localeCompare(String(a.op));
      if (criterio === "produzido_asc") return Number(a.produzido) - Number(b.produzido);
      if (criterio === "produzido_desc") return Number(b.produzido) - Number(a.produzido);
      if (criterio === "refugo_asc") return Number(a.refugo) - Number(b.refugo);
      if (criterio === "refugo_desc") return Number(b.refugo) - Number(a.refugo);
      return 0;
    });
    setDadosApontamentoState(dadosCopiados);
  };

  const apontamentoFilter = [
    { id: "data", label: "Data", type: "date-range" },
    { id: "produzido", label: "Produzido", type: "number-range" },
    { id: "refugo", label: "Refugo", type: "number-range" },
  ];

  const aplicarFiltrosApontamento = (filtrosSelecionados) => {
    let dadosFiltrados = [...todosApontamentos];

    if (filtrosSelecionados.produzido?.min != null) {
      dadosFiltrados = dadosFiltrados.filter((a) => Number(a.produzido) >= filtrosSelecionados.produzido.min);
    }
    if (filtrosSelecionados.produzido?.max != null) {
      dadosFiltrados = dadosFiltrados.filter((a) => Number(a.produzido) <= filtrosSelecionados.produzido.max);
    }
    if (filtrosSelecionados.refugo?.min != null) {
      dadosFiltrados = dadosFiltrados.filter((a) => Number(a.refugo) >= filtrosSelecionados.refugo.min);
    }
    if (filtrosSelecionados.refugo?.max != null) {
      dadosFiltrados = dadosFiltrados.filter((a) => Number(a.refugo) <= filtrosSelecionados.refugo.max);
    }
    if (filtrosSelecionados.data?.start) {
      dadosFiltrados = dadosFiltrados.filter(
        (a) => new Date(a.inicio || parseData(a.data)) >= new Date(filtrosSelecionados.data.start)
      );
    }
    if (filtrosSelecionados.data?.end) {
      dadosFiltrados = dadosFiltrados.filter(
        (a) => new Date(a.inicio || parseData(a.data)) <= new Date(filtrosSelecionados.data.end)
      );
    }

    setDadosApontamentoState(dadosFiltrados);
  };

  const dadosApontamentosFiltrados = dadosApontamentoState.filter((a) => {
    const termo = buscaApontamento.toLowerCase();
    return String(a.op).toLowerCase().includes(termo) || String(a.id).includes(termo);
  });

  if (carregando) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-900 mb-4" />
        <p className="text-lg text-gray-600 font-medium">Carregando usuário...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex flex-col">
      <div className="w-full mt-8 pb-10 px-8 space-y-4">
        <Link className="flex items-center" href="/adm/usuarios">
          <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
          <p className="text-xl font-semibold text-gray-800">Voltar para Usuários</p>
        </Link>

        <section id="infos_user" className="flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex">
              <Image
                src={
                  usuario?.imagem_perfil
                    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/imagens/${usuario.imagem_perfil}`
                    : "/userdefault.svg"
                }
                alt={usuario?.nome || "Usuário"}
                className="rounded-xl"
                width={250}
                height={250}
              />
              <div className="flex flex-col ml-5">
                <h1 className="text-3xl font-bold text-black">Nome: {usuario?.nome || "-"}</h1>
                <div className="flex gap-10">
                  <div className="flex flex-col gap-5 mt-2">
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">ID:</p>
                      <p className="text-xl font-medium text-black">{usuario?.id_usuario || operadorId}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Email:</p>
                      <p className="text-xl font-medium text-black">{usuario?.email || "-"}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">CPF:</p>
                      <p className="text-xl font-medium text-black">{usuario?.cpf || "-"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-5 mt-2">
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Setor:</p>
                      <p className="text-xl font-medium text-black">
                        {usuario?.setor?.nome_setor || "-"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Função:</p>
                      <p className="text-xl font-medium text-black">{usuario?.tipo || usuario?.funcao || "-"}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Turno:</p>
                      <p className="text-xl font-medium text-black">{usuario?.turno?.nome_turno || "-"}</p>
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
                  <FormEdicaoUsuario usuarioId={operadorId} onEdicaoSucesso={carregarDados} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger className="text-[#b30000] cursor-pointer">
                  <Trash2 className="w-9 h-9" />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoUsuario usuarioId={operadorId} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {usuario?.maquina && (
          <section id="maquina_responsavel" className="mt-5">
            <h1 className="font-bold text-3xl">Responsável por:</h1>
            <Link href={usuario.maquina.id_maquina ? `/adm/maquinas/${usuario.maquina.id_maquina}` : "#"}>
              <div className="bg-white w-full shadow-md border rounded-lg flex justify-between items-start p-8 mt-6">
                <div className="flex">
                  <Image src="/demo_maq.png" alt="Máquina" className="rounded-lg" width={200} height={150} />
                  <div className="ml-8 flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-[#212e4b] uppercase">{usuario.maquina.nome || "-"}</h1>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">ID:</p>
                      <p className="text-xl font-medium text-black">{usuario.maquina.id_maquina || "-"}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Série:</p>
                      <p className="text-xl font-medium text-black">{usuario.maquina.serie || "-"}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xl font-semibold text-black mr-2">Status:</p>
                      <p className="text-xl font-medium text-black">{usuario.maquina.status_atual || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        <h1 className="font-bold text-3xl mt-8">Produção</h1>
        <div className="flex flex-col gap-4">
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

        {/* Histórico de Eventos */}
        <section id="listagem_eventos">
          <div className="flex items-center justify-between gap-5 mt-8 mb-4">
            <h1 className="text-4xl font-semibold">Histórico de Eventos do Usuário</h1>
            <Dialog>
              <DialogTrigger className="cursor-pointer bg-blue-900 flex items-center px-4 py-2 rounded-md text-white font-semibold text-2xl gap-2">
                <Plus size={28} className="text-white cursor-pointer" />
                Cadastrar
              </DialogTrigger>
              <DialogContent>
                <FormCadastroEvento onCadastroSucesso={carregarDados} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none bg-transparent"
                placeholder="Busque por id, tipo ou motivo..."
                value={buscaEvento}
                onChange={(e) => setBuscaEvento(e.target.value)}
              />
              <button type="button" className="outline-none cursor-pointer mr-2">
                <Search />
              </button>
            </div>
          </div>

          <div className="row_ord_fil_cont flex items-center justify-between mt-3">
            <p>{dadosEventosExibidos.length} eventos encontrados</p>
            <div className="flex items-center gap-4 mb-3">
              <OrdenarDropdown label="Ordenar por" options={opcoesOrdenacaoEventos} onSortChange={handleSortEventos} />
              <FilterDropdown filtersConfig={eventosFilter} onApply={aplicarFiltrosEventos} />
            </div>
          </div>

          {dadosEventosExibidos.length > 0 ? (
            <TableListagens
              data={dadosEventosExibidos}
              columns={colunasEventos}
              acoesDropdown={(evento) => (
                <>
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
                      <FormEdicaoEvento eventoId={evento.id} onEdicaoSucesso={carregarDados} />
                    </DialogContent>
                  </Dialog>
                </>
              )}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold">Nenhum evento encontrado</h2>
              <p>Não há eventos vinculados à máquina deste usuário ou nenhum resultado para a busca.</p>
            </div>
          )}
        </section>

        {/* Histórico de Apontamentos */}
        <section id="listagem_apontamentos" className="mt-10">
          <h1 className="text-4xl font-semibold mb-4">Histórico de Apontamentos do Usuário</h1>

          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none bg-transparent"
                placeholder="Busque por OP ou id..."
                value={buscaApontamento}
                onChange={(e) => setBuscaApontamento(e.target.value)}
              />
              <button type="button" className="outline-none cursor-pointer mr-2">
                <Search />
              </button>
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
              <FilterDropdown filtersConfig={apontamentoFilter} onApply={aplicarFiltrosApontamento} />
            </div>
          </div>

          {dadosApontamentosFiltrados.length > 0 ? (
            <TableListagens
              data={dadosApontamentosFiltrados}
              columns={colunasApontamento}
              acoesDropdown={(apontamento) => (
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/adm/ordensDeProducao/${apontamento.id_ordem || apontamento.op}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Ver OP relacionada
                  </Link>
                </DropdownMenuItem>
              )}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold">Nenhum apontamento encontrado</h2>
              <p>Não encontramos apontamentos para este usuário.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
