"use client"

import Header from "@/components/ui/topbar";
import { MotivoRefugoMaquinaWidget } from "@/features/maquinas/MotivoRefugoMaquinaWidget";
import { MotivoSetupMaquinaWidget } from "@/features/maquinas/MotivoSetupMaquinaWidget";
import { OEEMaquinaWidget } from "@/features/maquinas/OEEMaquinaWidget";
import { OEEEvolucaoMaquinaWidget } from "@/features/maquinas/OEEEvolucaoMaquinaWidget";
import { VelocidadeMaquinaWidget } from "@/features/maquinas/VelocidadeMaquinaWidget";

import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { DuracaoEvento } from "@/components/ui/duracaoEvento";
import { DataEvento } from "@/components/ui/dataEvento";

import { BellRing, Pencil, EyeIcon, ChevronDown, Trash2, Flame, Plus, Search, Loader2 } from "lucide-react";

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
import FormCadastroEvento from "@/components/ui/forms/historicoEventos/formCadastroEvento";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import ModalSucessNotificacao from "@/components/ui/forms/historicoEventos/modalSucessNotificacao";
import FormEdicaoEvento from "@/components/ui/forms/historicoEventos/formEdicaoEvento";
import { maquinaCrudService } from "@/services/maquinaCrudService";
import { apiFetch } from "@/lib/api";
import DetalhesEvento from "@/components/ui/forms/historicoEventos/modalDetalhesEvento";


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
  { id: 'op', key: 'op', label: 'OP Afetada', className: 'w-30 text-center justify-center pl-5' },
  {
    id: 'data',
    key: 'data',
    label: 'Data (Início - Fim)',
    className: 'pl-10',
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

const dadosOriginais = [
  { id: 1, tipoEvento: 'Setup', data: '26/03 (08:00 - 09:00)', duracao: '00:35', motivo: 'Troca de ferramenta', inicio: "2025-03-26T08:00:00.000Z", fim: null },
  { id: 2, tipoEvento: 'Parada', data: '06/01 (09:30 - 10:15)', duracao: '00:45', motivo: 'Manutenção corretiva', inicio: "2025-01-06T09:30:00.000Z", fim: "2025-01-06T10:15:00.000Z" },
  { id: 3, tipoEvento: 'Setup', data: '13/09 (10:15 - 10:35)', duracao: '00:20', motivo: 'Ajuste de parâmetros', inicio: "2025-09-13T10:15:00.000Z", fim: "2025-09-13T10:35:00.000Z" },
  { id: 4, tipoEvento: 'Parada', data: '30/09 (11:00 - 12:00)', duracao: '01:00', motivo: 'Falha elétrica', inicio: "2025-09-30T11:00:00.000Z", fim: "2025-09-30T12:00:00.000Z" },
];

export default function MaquinaDetalhePage({ params }) {
  const { id } = use(params);
  const maquinaId = Number(id);
  const [maquina, setMaquina] = useState(null);
  const [dados, setDados] = useState([]);
  const [dadosApontamentoState, setDadosApontamentoState] = useState([]);
  const [todosEventos, setTodosEventos] = useState([]);
  const [todosApontamentos, setTodosApontamentos] = useState([]);
  const [loadingMaquina, setLoadingMaquina] = useState(true);
  const [velocidade, setVelocidade] = useState("")

  const imagemMaquina = (() => {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");
    if (!maquina?.imagem) return "/demo_maq.png";
    const imagem = String(maquina.imagem).replaceAll("\\", "/");
    if (imagem.startsWith("http")) return imagem;
    if (imagem.startsWith("/uploads/")) return `${apiUrl}${imagem}`;
    const nomeArquivo = imagem.split("/").pop();
    return `${apiUrl}/uploads/imagens/${nomeArquivo}`;
  })();

  const formatarData = (valor) => {
    if (!valor) return "-";
    return new Date(valor).toLocaleDateString("pt-BR");
  };

  const formatarPeriodo = (inicio, fim) => {
    if (!inicio) return "-";
    const dataInicio = new Date(inicio);
    const dataFim = fim ? new Date(fim) : null;
    const data = dataInicio.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    const horaInicio = dataInicio.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const horaFim = dataFim ? dataFim.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--:--";
    return `${data} (${horaInicio} - ${horaFim})`;
  };

  const formatarDuracao = (minutos) => {
    const total = Number(minutos) || 0;
    const horas = Math.floor(total / 60);
    const mins = Math.round(total % 60);
    return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  useEffect(() => {
    async function carregarMaquina() {
      setLoadingMaquina(true);
      try {
        const [respostaMaquina, respostaHistorico] = await Promise.all([
          maquinaCrudService.getById(maquinaId),
          apiFetch(`/api/maquinas/${maquinaId}/historico-eventos`),
        ]);

        setMaquina(respostaMaquina.dados || respostaMaquina);
        const historico = respostaHistorico.dados || [];
        const eventos = historico
          .filter((item) => item.tipo !== "Producao")
          .map((item) => ({
            ...item,
            tipoEvento: item.tipo,
            data: formatarPeriodo(item.inicio, item.fim),
            duracao: formatarDuracao(item.duracao_minutos),
            motivo: item.motivo || "-",
          }));
        const apontamentos = historico
          .filter((item) => item.tipo === "Producao")
          .map((item) => ({
            ...item,
            op: item.ordem_producao?.codigo_lote || item.ordem_producao?.id_ordem || "-",
            data: formatarPeriodo(item.inicio, item.fim),
            duracao: formatarDuracao(item.duracao_minutos),
            produzido: String(item.produzido || 0),
            refugo: String(item.refugo || 0),
            observacao: item.motivo || "-",
          }));

        setTodosEventos(eventos);
        setDados(eventos);
        setTodosApontamentos(apontamentos);
        setDadosApontamentoState(apontamentos);
      } finally {
        setLoadingMaquina(false);
      }
    }

    if (maquinaId) {
      carregarMaquina();
    }
  }, [maquinaId]);

   useEffect(() => {
          async function carregar() {
              try {
                  if (!maquinaId) {
                      setVelocidade("");
                      return;
                  }
                  const options = { method: "GET" };
                  const dados = await apiFetch(`/api/maquinas/${maquinaId}/velocidade`, options)
                  console.log(dados)
                  setVelocidade(dados.dados);
              } catch (error) {
                  console.log(error)
                  toast.error("Erro ao carregar velocidade média da máquina");
              }
          }
  
          carregar();
      }, [maquinaId]);

  const [buscaEvento, setBuscaEvento] = useState("");
  const [buscaApontamento, setBuscaApontamento] = useState("");

  const parseData = (dataStr) => {
    const [dataParte] = dataStr.split(" ");
    const [dia, mes] = dataParte.split("/");

    // ano fixo (ajuste se precisar)
    return new Date(`2025-${mes}-${dia}`);
  };

  const dadosApontamento = [
    { id: 1, op: '0098', data: '26/03 (08:00 - 09:00)', duracao: '00:35', produzido: '15', refugo: '2', observacao: 'Troca de ferramenta', inicio: "2025-03-26T08:00:00.000Z", fim: null },
    { id: 2, op: '1234', data: '06/01 (09:30 - 10:15)', duracao: '00:45', produzido: '10', refugo: '5', observacao: 'Manutenção corretiva', inicio: "2025-03-26T08:00:00.000Z", fim: null },
    { id: 3, op: '5678', inicio: "2025-09-13T10:15:00.000Z", fim: "2025-09-13T10:35:00.000Z", duracao: '00:20', produzido: '20', refugo: '1', observacao: 'Ajuste de parâmetros' },
    { id: 4, op: '9012', inicio: "2025-09-13T10:15:00.000Z", fim: "2025-09-13T10:35:00.000Z", duracao: '01:00', produzido: '5', refugo: '8', observacao: 'Refugo elevado devido a falta de aquecimento' },
    { id: 5, op: '1223', inicio: "2025-09-13T10:15:00.000Z", fim: "2025-09-13T10:35:00.000Z", duracao: '01:00', produzido: '6', refugo: '8', observacao: 'Retirada de amostras para o laboratório de qualidade' },
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
    let dadosFiltrados = [...todosEventos];

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
      (evento.tipoEvento?.toLowerCase() || "").includes(termo) ||
      (evento.motivo?.toLowerCase() || "").includes(termo) ||
      evento.id?.toString().includes(termo)
    );
  });

  // -------------------------------------------------------------------------------------------------- Apontamentos  --------------------------------------------------------------------------------------------------
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
    let dadosFiltrados = [...todosApontamentos];

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
      String(a.op || "").toLowerCase().includes(termo) ||
      a.id?.toString().includes(termo)
    );
  });

  if (loadingMaquina) {
    return (
      <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-900 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Carregando máquina...</p>
        </div>
      </main>
    );
  }

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
                {maquina?.nome || `Máquina ${maquinaId}`}
              </h1>
            </div>

            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger className="text-[#122f60] cursor-pointer">
                  <Pencil size={36} className="mr-1" />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoMaquina maquinaId={maquinaId} />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="text-[#b30000] cursor-pointer">
                  <Trash2 className=" w-9 h-9" />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoMaquina maquinaId={maquinaId} onExcluir={maquinaCrudService.delete} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex gap-8 mt-5">
            <div className="bg-white rounded-xl p-13  ">
              <img
                src={imagemMaquina}
                alt={maquina?.nome || "Máquina"}
                className="rounded-xl w-[150px] h-[150px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/demo_maq.png";
                }}
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">ID:</p>
                <p className="text-xl font-medium text-black">{maquina?.id_maquina || maquinaId}</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Série:</p>
                <p className="text-xl font-medium text-black">{maquina?.serie || "-"}</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Setor:</p>
                <p className="text-xl font-medium text-black">{maquina?.id_setor || "-"}</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Status:</p>
                <p className="rounded-xl px-3 text-[#b30000] font-semibold bg-red-100">{maquina?.status_atual || maquina?.status || "-"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Operador:</p>
                <p className="text-xl font-medium text-black">{maquina?.id_operador || "-"}</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Data de Aquisição:</p>
                <p className="text-xl font-medium text-black">{formatarData(maquina?.data_aquisicao)}</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-black mr-2">Velocidade Média:</p>
                <p className="text-xl font-medium text-black">{ velocidade.velocidade_atual ||"-"}</p>
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
                        <EyeIcon strokeWidth={2} className="mr-1 h-4 w-4 text-primary" />
                        Ver Detalhes
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DetalhesEvento eventoId={maquina.id} />
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
