"use client"

import { SetorMaquinaStatusWidget } from "@/features/setores/SetorMaquinaStatusWidget";
import { SetorOEEMedioWidget } from "@/features/setores/SetorOEEMedioWidget";
import { SetorOEEEvolucaoWidget } from "@/features/setores/SetorOEEEvolucaoWidget";
import { SetorTopOperadoresWidget } from "@/features/setores/SetorTopOperadoresWidget";
import { SetorMotivosParadaWidget } from "@/features/setores/SetorMotivosParadaWidget";
import { SetorProducaoSemanalWidget } from "@/features/setores/SetorProducaoSemanalWidget";
import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TableListagens from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, EyeIcon } from "lucide-react";
import FormExclusaoSetor from "@/components/ui/forms/setores/formExclusaoSetor";
import FormEdicaoSetor from "@/components/ui/forms/setores/formEdicaoSetor";
import FormCriacaoTurno from "@/components/ui/forms/setores/formCadastroTurnoSetor";
import FormCadastroMaquina from "@/components/ui/forms/maquinas/formCadastroMaquina";
import FormCadastroUsuario from "@/components/ui/forms/usuarios/formCadastroUsuario";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import turnoCrudService from "@/services/turnoCrudService";
import { filtrarPorNumberRange } from "@/lib/filterUtils";
import FormEdicaoMaquina from "@/components/ui/forms/maquinas/formEdicaoMaquina";
import FormExclusaoMaquina from "@/components/ui/forms/maquinas/formExclusaoMaquina";
import FormEdicaoUsuario from "@/components/ui/forms/usuarios/formEdicaoUsuario";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";
import { apiFetch } from "@/lib/api";
import { setorCrudService } from "@/services/setorCrudService";
import { maquinaCrudService } from "@/services/maquinaCrudService";

// Layout geral
import {
  PageLayout,
  PageHeader,
  SectionDivider,
  FadeUpItem,
  ContentGrid,
  WidgetCard,
  SearchBar,
  FilterRow,
  EmptyState,
  AsymmetricGrid,
} from "@/components/AnimatedComponents";

// Componentes de detalhe
import {
  DetailPageContainer,
  DetailBackLink,
  DetailSectionTitle,
  DetailWidgetGrid,
  DetailWidgetCard,
  DetailListingSection,
  ListingTabs,
  DetailActions,
} from "@/components/DetailComponents";


const colunaUsuarioSetor = [
  { id: "nome", key: "nome", label: "Nome", className: "w-1/7" },
  { id: "id_usuario", key: "id_usuario", label: "ID", className: "w-1/5" },
  { id: "funcao", key: "funcao", label: "Função", className: "w-1/5" },
  { id: "turno", key: "turno", label: "Turno", className: "w-1/5" },
  {
    id: "oee_medio",
    key: "oee_medio",
    label: "OEE Médio",
    className: "w-45",
  }
];

const colunaMaquinaSetor = [
  { id: "nome", key: "nome", label: "Nome", className: "w-1/7" },
  { id: "id_maquina", key: "id_maquina", label: "ID", className: "w-1/7" },
  { id: "oee_atual", key: "oee_atual", label: "OEE Atual", className: "w-45" },
  { id: "operador", key: "operador", label: "Operador", className: "w-1/5" },
  {
    id: 'status',
    key: 'status',
    label: 'Status',
    className: 'text-center justify-center',
    icone: (valor) => {
      const config = {
        "Produzindo": {
          variant: "outline",
          className: "bg-green-500/15 text-green-600 text-sm font-semibold border-none"
        },
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
  { id: "ultima_parada", key: "ultima_parada", label: "Última Parada", className: "w-1/5" },
];

export default function SetorEspecificoPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [setor, setSetor] = useState(null);
  const [maquinas, setMaquinas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [dadosMaquina, setDadosMaquina] = useState([]);
  const [dadosExibidos, setDadosExibidos] = useState([]);
  const [buscaMaquinas, setBuscaMaquinas] = useState("");
  const [buscaUsuarios, setBuscaUsuarios] = useState("");
  const [activeListTab, setActiveListTab] = useState("maquinas");
  const [maquinaParaExcluir, setMaquinaParaExcluir] = useState(null);

  const gestor = setor?.gestores?.[0]?.gestor;

  const formatarHorario = (valor) => {
    if (!valor) return "--:--";
    return new Date(valor).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const diasSemanaOrdem = {
    Domingo: 0,
    Segunda: 1,
    Segunda_feira: 1,
    Terca: 2,
    Terça: 2,
    Terca_feira: 2,
    Quarta: 3,
    Quarta_feira: 3,
    Quinta: 4,
    Quinta_feira: 4,
    Sexta: 5,
    Sexta_feira: 5,
    Sabado: 6,
    Sábado: 6,
  };

  const formatarDiaSemana = (dia) => String(dia || "")
    .replace(/_/g, "-")
    .replace("Terca", "Terça")
    .replace("Sabado", "Sábado");

  const agruparTurnos = (listaTurnos) => {
    const grupos = new Map();

    for (const turno of listaTurnos) {
      const chave = [
        turno.nome_turno,
        turno.hora_inicio,
        turno.hora_fim,
      ].join("|");

      const grupo = grupos.get(chave) ?? {
        ...turno,
        dias: [],
      };

      grupo.dias.push(turno.dia_semana);
      grupos.set(chave, grupo);
    }

    return Array.from(grupos.values()).map((turno) => ({
      ...turno,
      dias: [...new Set(turno.dias)]
        .sort((a, b) => (diasSemanaOrdem[a] ?? 99) - (diasSemanaOrdem[b] ?? 99))
        .map(formatarDiaSemana),
    }));
  };

  const normalizarMaquina = (maquina) => ({
    ...maquina,
    oee_atual: maquina.oee_atual ?? "-",
    operador: maquina.operador?.nome ?? maquina.operador ?? maquina.operador_atual ?? "-",
    status: maquina.status_atual || maquina.status || "-",
    ultima_parada: maquina.ultima_parada ?? maquina.ultimo_evento?.inicio ?? "-",
  });

  const normalizarOperador = (usuario) => ({
    ...usuario,
    id_usuario: usuario.id_usuario ?? usuario.id_operador,
    funcao: usuario.funcao ?? usuario.tipo ?? "Operador",
    turno: usuario.turnos?.length
      ? [...new Set(usuario.turnos.map((turno) => turno.nome_turno).filter(Boolean))].join(", ")
      : usuario.turno?.nome_turno ?? usuario.turno ?? "-",
    oee_medio: usuario.oee_medio ?? "-",
  });

  const refresh = useCallback(async () => {
    if (!id) return;

    const [setorResp, maquinasResp, operadoresResp, turnosResp] = await Promise.all([
      setorCrudService.getById(id),
      apiFetch(`/api/maquinas/setor/${id}`, { method: "GET" }),
      setorCrudService.listarOperadores(id),
      turnoCrudService.getBySetor(id),
    ]);

    const setorAtual = setorResp.dados || setorResp;
    const maquinasAtualizadas = (maquinasResp.dados || []).map(normalizarMaquina);
    const operadoresAtualizados = (operadoresResp.dados || []).map(normalizarOperador);
    const gestoresAtualizados = (setorAtual.gestores || []).map(({ gestor }) => ({
      ...gestor,
      funcao: "Gestor",
      turno: "-",
      oee_medio: "-",
    }));
    const usuariosAtualizados = [...gestoresAtualizados, ...operadoresAtualizados];
    const turnosAtualizados = turnosResp.dados || [];

    setSetor(setorAtual);
    setMaquinas(maquinasAtualizadas);
    setDadosMaquina(maquinasAtualizadas);
    setUsuarios(usuariosAtualizados);
    setDadosExibidos(usuariosAtualizados);
    setTurnos(turnosAtualizados);
  }, [id]);

  useEffect(() => {
    refresh().catch((error) => console.error("Erro ao carregar setor:", error));
  }, [refresh]);

  // opções de ordenação para máquinas e usuários
  const opcoesOrdenacaoMaquinas = [
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'OEE Crescente', value: 'oee_asc' },
    { label: 'OEE Decrescente', value: 'oee_desc' },
    { label: 'Status', value: 'status' },
  ];

  const opcoesOrdenacaoUsers = [
    { label: 'Ordem Alfabética', value: 'nome_asc' },
    { label: 'ID Crescente', value: 'id_asc' },
    { label: 'ID Decrescente', value: 'id_desc' },
    { label: 'OEE Crescente', value: 'oee_asc' },
    { label: 'OEE Decrescente', value: 'oee_desc' },
    { label: 'Status', value: 'status' },
    { label: 'Turno', value: 'turno' },
    { label: 'Função', value: 'funcao' }
  ];

  // filtros para máquinas e usuários
  const maquinasFilter = [
    { id: "status", label: "Tipo", type: "checkbox", options: ["Parada", "Setup", "Produzindo", "Parada Justificada", "Parada Não Justificada"] },
    { id: "data", label: "Data", type: "date-range" },
    { id: "oee", label: "OEE Médio", type: "number-range" },
  ];

  const turnosAgrupados = agruparTurnos(turnos);
  const opcoesTurnoFiltro = [...new Set(turnosAgrupados.map((t) => t.nome_turno).filter(Boolean))];

  const usuariosFilter = [
    { id: "funcao", label: "Função", type: "checkbox", options: ["Operador", "Gestor"] },
    { id: "turno", label: "Turno", type: "checkbox", options: opcoesTurnoFiltro },
    { id: "oee", label: "OEE Médio", type: "number-range" },
  ];

  // funções para ordenação e aplicação de filtros
  const handleSortMaquinas = (criterio) => {
    const parseOEE = (valor) => parseFloat(String(valor).replace("%", "")) || 0;
    const dadosOrdenados = [...dadosMaquina].sort((a, b) => {
      switch (criterio) {
        case "id_asc": return (a.id_maquina || 0) - (b.id_maquina || 0);
        case "id_desc": return (b.id_maquina || 0) - (a.id_maquina || 0);
        case "oee_asc": return parseOEE(a.oee_atual) - parseOEE(b.oee_atual);
        case "oee_desc": return parseOEE(b.oee_atual) - parseOEE(a.oee_atual);
        case "status": return String(a.status).localeCompare(String(b.status));
        default: return 0;
      }
    });
    setDadosMaquina(dadosOrdenados);
  };

  const handleSortUsuarios = (criterio) => {
    const parseOEE = (valor) => parseFloat(String(valor).replace("%", "")) || 0;
    const dadosOrdenados = [...dadosExibidos].sort((a, b) => {
      switch (criterio) {
        case "nome_asc": return String(a.nome).localeCompare(String(b.nome));
        case "id_asc": return (a.id_usuario || 0) - (b.id_usuario || 0);
        case "id_desc": return (b.id_usuario || 0) - (a.id_usuario || 0);
        case "oee_asc": return parseOEE(a.oee_medio) - parseOEE(b.oee_medio);
        case "oee_desc": return parseOEE(b.oee_medio) - parseOEE(a.oee_medio);
        case "turno": return String(a.turno).localeCompare(String(b.turno));
        case "funcao": return String(a.funcao).localeCompare(String(b.funcao));
        default: return 0;
      }
    });
    setDadosExibidos(dadosOrdenados);
  };

  const aplicarFiltrosMaquinas = (filtrosSelecionados) => {
    let filtrados = [...maquinas];
    if (filtrosSelecionados.status?.length) {
      filtrados = filtrados.filter((maquina) => filtrosSelecionados.status.includes(maquina.status));
    }
    if (filtrosSelecionados.data?.start) {
      const inicio = new Date(filtrosSelecionados.data.start);
      filtrados = filtrados.filter((maquina) => {
        const dataParada = maquina.ultima_parada;
        return dataParada && dataParada !== "-" && new Date(dataParada) >= inicio;
      });
    }
    if (filtrosSelecionados.data?.end) {
      const fim = new Date(filtrosSelecionados.data.end);
      filtrados = filtrados.filter((maquina) => {
        const dataParada = maquina.ultima_parada;
        return dataParada && dataParada !== "-" && new Date(dataParada) <= fim;
      });
    }
    filtrados = filtrarPorNumberRange(filtrados, "oee_atual", filtrosSelecionados.oee);
    setDadosMaquina(filtrados);
  };

  const aplicarFiltrosUsers = (filtrosSelecionados) => {
    let filtrados = [...usuarios];
    if (filtrosSelecionados.funcao?.length) {
      filtrados = filtrados.filter((usuario) => filtrosSelecionados.funcao.includes(usuario.funcao));
    }
    if (filtrosSelecionados.turno?.length) {
      filtrados = filtrados.filter((usuario) => {
        const turnosUsuario = String(usuario.turno || "").split(",").map((t) => t.trim());
        return filtrosSelecionados.turno.some((t) => turnosUsuario.includes(t));
      });
    }
    filtrados = filtrarPorNumberRange(filtrados, "oee_medio", filtrosSelecionados.oee);
    setDadosExibidos(filtrados);
  };

  const maquinasExibidas = dadosMaquina.filter((maquina) => {
    const termo = buscaMaquinas.toLowerCase();
    return maquina.nome?.toLowerCase().includes(termo) || String(maquina.id_maquina || "").includes(termo);
  });

  const usuariosExibidos = dadosExibidos.filter((usuario) => {
    const termo = buscaUsuarios.toLowerCase();
    return usuario.nome?.toLowerCase().includes(termo) || String(usuario.id_usuario || "").includes(termo);
  });

  const excluirSetorAtual = async () => {
    router.push("/adm/setores");
  };

  return (
    <PageLayout>
      <DetailPageContainer>
        {/* Voltar */}
        <DetailBackLink href="/adm/setores" label="Voltar para Setores" />

        <PageHeader
          title={`Setor: ${setor?.nome_setor || id}`}
          action={
            <DetailActions>
              <Dialog>
                <DialogTrigger className="text-(--pencil) cursor-pointer">
                  <Pencil size={32} />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoSetor setorId={id} onEdicaoSucesso={refresh} />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="text-(--trash) cursor-pointer">
                  <Trash2 size={32} />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoSetor setorId={id} onExclusaoSucesso={excluirSetorAtual} />
                </DialogContent>
              </Dialog>
            </DetailActions>
          }
        />

        <FadeUpItem className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-xl font-medium text-gray-900">
          <div className="flex flex-col gap-2">
            <p>
              Gestor Responsável:{" "}
              {gestor ? (
                <Link href={`/usuarios/${gestor.id_usuario}`} className="hover:underline ml-1">
                  {gestor.nome}
                </Link>
              ) : (
                <span className="ml-1">-</span>
              )}
            </p>

            <div className="flex">
              <p>Turnos:</p>
              <ul className="list-disc list-inside ml-4">
                {turnosAgrupados.length > 0 ? (
                  turnosAgrupados.map((t) => (
                    <li key={`${t.nome_turno}-${t.hora_inicio}-${t.hora_fim}`}>
                      {t.nome_turno} ({t.dias.join(", ")}): {formatarHorario(t.hora_inicio)} - {formatarHorario(t.hora_fim)}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">Nenhum turno cadastrado para este setor</li>
                )}
              </ul>
            </div>

            <p>Localização: {setor?.localizacao || "-"}</p>
          </div>
        </FadeUpItem>

        {/* Botão Criar Turno */}
        <FadeUpItem className="flex justify-end">
          <Dialog>
            <DialogTrigger className="cursor-pointer bg-secondary-foreground flex items-center px-4 py-2 rounded-md text-white font-semibold text-xl gap-2">
              <Plus size={22} />
              Criar Turno
            </DialogTrigger>
            <DialogContent>
              <FormCriacaoTurno onSuccess={refresh} />
            </DialogContent>
          </Dialog>
        </FadeUpItem>

        {/* ── Gráficos ── */}
        <DetailSectionTitle title="Desempenho do Setor" />

        <AsymmetricGrid>
          <DetailWidgetCard colSpan="md:col-span-2">
            <SetorOEEEvolucaoWidget setorId={id} />
          </DetailWidgetCard>
          <DetailWidgetCard centered>
            <SetorOEEMedioWidget setorId={id} />
            <SetorMaquinaStatusWidget setorId={id} />
          </DetailWidgetCard>
        </AsymmetricGrid>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 w-full">
          <DetailWidgetCard>
            <SetorProducaoSemanalWidget setorId={id} />
          </DetailWidgetCard>

          <DetailWidgetCard>
            <SetorTopOperadoresWidget setorId={id} />
          </DetailWidgetCard>

          <DetailWidgetCard>
            <SetorMotivosParadaWidget setorId={id} />
          </DetailWidgetCard>
        </div>

        <ListingTabs
          className="mt-8"
          activeTab={activeListTab}
          onChange={setActiveListTab}
          tabs={[
            { id: "maquinas", label: "Inventário de Máquinas" },
            { id: "usuarios", label: "Usuários do Setor" },
          ]}
        />

        {activeListTab === "maquinas" ? (
          <DetailListingSection
            id="listagem_maquinas"
            title="Inventário de Máquinas do Setor"
            action={
              <Dialog>
                <DialogTrigger className="cursor-pointer bg-secondary-foreground flex items-center px-4 py-2 rounded-md text-white font-semibold text-xl gap-2">
                  <Plus size={22} />
                  Cadastrar
                </DialogTrigger>
                <DialogContent>
                  <FormCadastroMaquina onCadastroSucesso={refresh} />
                </DialogContent>
              </Dialog>
            }
            search={
              <SearchBar
                value={buscaMaquinas}
                onChange={(e) => setBuscaMaquinas(e.target.value)}
                placeholder="Busque por nome ou id..."
              />
            }
            filterRow={
              <FilterRow
                count={maquinasExibidas.length}
                label="máquinas"
                actions={
                  <>
                    <OrdenarDropdown
                      label="Ordenar por"
                      options={opcoesOrdenacaoMaquinas}
                      onSortChange={handleSortMaquinas}
                    />
                    <FilterDropdown
                      filtersConfig={maquinasFilter}
                      onApply={aplicarFiltrosMaquinas}
                    />
                  </>
                }
              />
            }
          >
            {maquinasExibidas.length > 0 ? (
              <TableListagens
                data={maquinasExibidas}
                columns={colunaMaquinaSetor}
                acoesDropdown={(maquina) => (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`/adm/maquinas/${maquina.id_maquina}`}>
                        <EyeIcon className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Link>
                    </DropdownMenuItem>

                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4 text-primary" />
                          Editar
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <FormEdicaoMaquina maquinaId={maquina.id_maquina} onEdicaoSucesso={refresh} />
                      </DialogContent>
                    </Dialog>

                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setMaquinaParaExcluir(maquina.id_maquina);
                      }}
                      className="cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-vermelho-vivido" />
                      Excluir
                    </DropdownMenuItem>
                  </>
                )}
              />
            ) : (
              <EmptyState
                title="Nenhuma máquina encontrada"
                message={`Não encontramos resultados para "${buscaMaquinas}".`}
              />
            )}
          </DetailListingSection>
        ) : (
          <DetailListingSection
            id="listagem_usuarios"
            title="Listagem de Usuários do Setor"
            action={
              <Dialog>
                <DialogTrigger className="cursor-pointer bg-secondary-foreground flex items-center px-4 py-2 rounded-md text-white font-semibold text-xl gap-2">
                  <Plus size={22} />
                  Cadastrar
                </DialogTrigger>
                <DialogContent>
                  <FormCadastroUsuario onCadastroSucesso={refresh} />
                </DialogContent>
              </Dialog>
            }
            search={
              <SearchBar
                value={buscaUsuarios}
                onChange={(e) => setBuscaUsuarios(e.target.value)}
                placeholder="Busque por nome ou id..."
              />
            }
            filterRow={
              <FilterRow
                count={usuariosExibidos.length}
                label="usuários"
                actions={
                  <>
                    <OrdenarDropdown
                      label="Ordenar por"
                      options={opcoesOrdenacaoUsers}
                      onSortChange={handleSortUsuarios}
                    />
                    <FilterDropdown
                      filtersConfig={usuariosFilter}
                      onApply={aplicarFiltrosUsers}
                    />
                  </>
                }
              />
            }
          >
            {usuariosExibidos.length > 0 ? (
              <TableListagens
                data={usuariosExibidos}
                columns={colunaUsuarioSetor}
                acoesDropdown={(usuario) => (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link
                        href={
                          usuario.funcao === "Gestor"
                            ? `/adm/usuarios/gestor/${usuario.id_usuario}`
                            : `/adm/usuarios/${usuario.id_usuario}`
                        }
                      >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Link>
                    </DropdownMenuItem>

                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4 text-primary" />
                          Editar
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <FormEdicaoUsuario usuarioId={usuario.id_usuario} onEdicaoSucesso={refresh} />
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4 text-vermelho-vivido" />
                          Excluir
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <FormExclusaoUsuario usuarioId={usuario.id_usuario} onExclusaoSucesso={refresh} />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              />
            ) : (
              <EmptyState
                title="Nenhum usuário encontrado"
                message={`Não encontramos resultados para "${buscaUsuarios}".`}
              />
            )}
          </DetailListingSection>
        )}

      </DetailPageContainer>

      <Dialog
        open={maquinaParaExcluir != null}
        onOpenChange={(open) => {
          if (!open) setMaquinaParaExcluir(null);
        }}
      >
        <DialogContent>
          {maquinaParaExcluir != null && (
            <FormExclusaoMaquina
              key={maquinaParaExcluir}
              maquinaId={maquinaParaExcluir}
              onExcluir={async (maquinaId) => {
                await maquinaCrudService.delete(maquinaId);
                await refresh();
              }}
              onExclusaoSucesso={() => setMaquinaParaExcluir(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
//não testado, a pagina não abre pra mim