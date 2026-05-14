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
import { ChevronDown, Pencil, Trash2, Plus, Search, EyeIcon } from "lucide-react";
import FormExclusaoSetor from "@/components/ui/forms/setores/formExclusaoSetor";
import FormEdicaoSetor from "@/components/ui/forms/setores/formEdicaoSetor";
import FormCriacaoTurno from "@/components/ui/forms/setores/formCadastroTurnoSetor";
import FormCadastroMaquina from "@/components/ui/forms/maquinas/formCadastroMaquina";
import FormCadastroUsuario from "@/components/ui/forms/usuarios/formCadastroUsuario";
import OrdenarDropdown from "@/components/ui/OrdenarDropdown";
import FilterDropdown from "@/components/ui/FilterDropdown";
import turnoCrudService from "@/services/turnoCrudService";
import FormEdicaoMaquina from "@/components/ui/forms/maquinas/formEdicaoMaquina";
import FormExclusaoMaquina from "@/components/ui/forms/maquinas/formExclusaoMaquina";
import FormEdicaoUsuario from "@/components/ui/forms/usuarios/formEdicaoUsuario";
import FormExclusaoUsuario from "@/components/ui/forms/usuarios/formExclusaoUsuario";
import { apiFetch } from "@/lib/api";
import { setorCrudService } from "@/services/setorCrudService";
import { maquinaCrudService } from "@/services/maquinaCrudService";


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
  { id: "oee_atual", key: "oee_atual", label: "OEE Atual", className: "w-45", },
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
          variant: "secondary",
          className: "bg-[var(--status-warning-bg)] text-amarelo font-semibold text-sm "
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
  
  const gestor = setor?.gestores?.[0]?.gestor;

  const normalizarMaquina = (maquina) => ({
    ...maquina,
    oee_atual: maquina.oee_atual ?? "-",
    operador: maquina.operador?.nome ?? maquina.operador ?? "-",
    status: maquina.status_atual || maquina.status || "-",
    ultima_parada: maquina.ultima_parada ?? "-",
  });

  const normalizarOperador = (usuario) => ({
    ...usuario,
    id_usuario: usuario.id_usuario ?? usuario.id_operador,
    funcao: usuario.funcao ?? usuario.tipo ?? "Operador",
    turno: usuario.turno?.nome_turno ?? usuario.turno ?? "-",
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
  //opções de ordenação para máquinas e usuários
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

  //filtros para máquinas e usuários
  const maquinasFilter = [
    { id: "status", label: "Tipo", type: "checkbox", options: ["Parada", "Setup", "Produzindo", "Parada Justificada", "Parada Não Justificada"] },
    { id: "data", label: "Data", type: "date-range" },
    { id: "oee", label: "OEE Médio", type: "number-range" },
  ];

  const usuariosFilter = [
    { id: "funcao", label: "Função", type: "checkbox", options: ["Operador", "Gestor"] },
    { id: "turno", label: "Turno", type: "checkbox", options: ["Manhã", "Tarde", "Noite"] },
    { id: "oee", label: "OEE Médio", type: "number-range" },
  ]

  // funções para ordenação e aplicação de filtros 
  // ainda precisam ser implementadas! no momento que elas foram feitas, não havia tabelas ainda
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
  }

  const aplicarFiltrosMaquinas = (filtrosSelecionados) => {
    let filtrados = [...maquinas];
    if (filtrosSelecionados.status?.length) {
      filtrados = filtrados.filter((maquina) => filtrosSelecionados.status.includes(maquina.status));
    }
    if (filtrosSelecionados.oee) {
      const { min, max } = filtrosSelecionados.oee;
      filtrados = filtrados.filter((maquina) => {
        const oee = parseFloat(String(maquina.oee_atual).replace("%", "")) || 0;
        return oee >= (min || 0) && oee <= (max || Infinity);
      });
    }
    setDadosMaquina(filtrados);
  }

  const aplicarFiltrosUsers = (filtrosSelecionados) => {
    let filtrados = [...usuarios];
    if (filtrosSelecionados.funcao?.length) {
      filtrados = filtrados.filter((usuario) => filtrosSelecionados.funcao.includes(usuario.funcao));
    }
    if (filtrosSelecionados.turno?.length) {
      filtrados = filtrados.filter((usuario) => filtrosSelecionados.turno.includes(usuario.turno));
    }
    if (filtrosSelecionados.oee) {
      const { min, max } = filtrosSelecionados.oee;
      filtrados = filtrados.filter((usuario) => {
        const oee = parseFloat(String(usuario.oee_medio).replace("%", "")) || 0;
        return oee >= (min || 0) && oee <= (max || Infinity);
      });
    }
    setDadosExibidos(filtrados);
  }

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


      {/* Infos do Setor */}
      <div className="w-full mt-8 px-8 space-y-4">

        <Link className="flex items-center" href="/adm/setores">
          <ChevronDown className="mr-1 text-gray-500 inline-block transform -rotate-270" />
          <p className="text-xl font-semibold text-gray-800">Voltar para Setores</p>
        </Link>

        <section id="infos_setor" className="flex flex-col">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Setor: {setor?.nome_setor || id}</h1>

            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger className="text-[#122f60] cursor-pointer">
                  <Pencil size={36} className="mr-1" />
                </DialogTrigger>
                <DialogContent>
                  <FormEdicaoSetor setorId={id} onEdicaoSucesso={refresh} />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="text-[#b30000] cursor-pointer">
                  <Trash2 className=" w-9 h-9" />
                </DialogTrigger>
                <DialogContent>
                  <FormExclusaoSetor setorId={id} onExclusaoSucesso={excluirSetorAtual} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="py-3 font-medium text-gray-900 text-xl">
            <div className="flex flex-col gap-1">
              <p>Gestor Responsavel:
                {gestor ? (
                  <Link href={`/adm/usuarios/${gestor.id_usuario}`} className="hover:underline ml-2">
                    {gestor.nome}
                  </Link>
                ) : (
                  <span className="ml-2">-</span>
                )}
              </p>
              <div className="flex">
                <p>Turnos:</p>
                <ul className="list-disc list-inside ml-4">
                  {turnos.length > 0 ? (
                    turnos.map((t) => (
                      <li key={t.id_turno}>
                        {t.nome_turno} ({t.dia_semana}): {new Date(t.hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(t.hora_fim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">Nenhum turno cadastrado para este setor</li>
                  )}
                </ul>
              </div>
              <p>Localização: {setor?.localizacao || "-"}</p>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger className="cursor-pointer bg-blue-900 flex items-center px-4 py-2 rounded-md text-white font-semibold text-2xl gap-2">
              <Plus size={24} className="text-white " />
              Criar Turno
            </DialogTrigger>
            <DialogContent>
              <FormCriacaoTurno onSuccess={refresh} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Seção de Gráficos */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm h-full min-h-[240px] md:min-h-[300px]">
            <SetorMaquinaStatusWidget setorId={id} />
          </div>
          <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center h-full min-h-[240px] md:min-h-[300px]">
            <SetorOEEMedioWidget setorId={id} />
          </div>
        </section>


        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
            <SetorProducaoSemanalWidget setorId={id} />
          </div>
          <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm">
            <SetorTopOperadoresWidget setorId={id} />
          </div>
        </section>


        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm">
            <SetorMotivosParadaWidget setorId={id} />
          </div>
          <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
            <SetorOEEEvolucaoWidget setorId={id} />
          </div>
        </section>

        {/* LISTAGENS */}
        {/* Listagem de Máquinas */}
        <section id="listagem_maquinas" className="flex flex-col gap-4">

          <div className="flex items-center justify-between gap-5">
            <h1 className="text-4xl w-[125] font-semibold">
              Inventário de Máquinas do Setor
            </h1>

            <Dialog>
              <DialogTrigger className="cursor-pointer bg-blue-900 flex items-center px-4 py-2 rounded-md text-white font-semibold text-2xl gap-2">
                <Plus size={28} />
                Cadastrar
              </DialogTrigger>

              <FormCadastroMaquina onCadastroSucesso={refresh} />
            </Dialog>
          </div>

          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none bg-transparent"
                placeholder="Busque por nome ou id..."
                value={buscaMaquinas}
                onChange={(e) => setBuscaMaquinas(e.target.value)}
              />
              <button className="mr-2">
                <Search />
              </button>
            </div>
          </div>

          {/* Listagem de Máquinas */}
          <div className="flex items-center justify-between w-full mt-3">
            <p>{maquinasExibidas.length} máquinas encontradas</p>

            <div className="flex items-center gap-4">
              <OrdenarDropdown
                label="Ordenar por"
                options={opcoesOrdenacaoMaquinas}
                onSortChange={handleSortMaquinas}
              />

              <FilterDropdown
                filtersConfig={maquinasFilter}
                onApply={aplicarFiltrosMaquinas}
              />
            </div>
          </div>
          <div className="flex flex-col flex-1 items-center w-full mt-4">
            {maquinasExibidas.length > 0 ? (
              /* dados só renderizam a tabela se tiver resultado */
              <TableListagens
                data={maquinasExibidas}
                columns={colunaMaquinaSetor}
                acoesDropdown={(setor) => (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`/adm/maquinas/${setor.id_maquina}`}>
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
                        <FormEdicaoMaquina maquinaId={setor.id_maquina} onEdicaoSucesso={refresh} />
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
                        <FormExclusaoMaquina maquinaId={setor.id_maquina} onExcluir={async (maquinaId) => { await maquinaCrudService.delete(maquinaId); await refresh(); }} />
                      </DialogContent>
                    </Dialog>

                  </>
                )}
              />
            ) : (
              /* se não tiver correspondência (length === 0), mostra apenas a div */
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 w-full mt-4">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhum setor encontrado</h2>
                {/* <p>Não encontramos nenhum resultado para "{busca}".</p> */}
              </div>
            )}
          </div>
        </section>

        {/* Listagem Usuários */}
        <section id="listagem_usuarios" className="flex flex-col gap-4">

          <div className="flex items-center justify-between gap-5">
            <h1 className="text-4xl w-[125] font-semibold">
              Listagem de Usuários do Setor
            </h1>

            <Dialog>
              <DialogTrigger className="cursor-pointer bg-blue-900 flex items-center px-4 py-2 rounded-md text-white font-semibold text-2xl gap-2">
                <Plus size={28} />
                Cadastrar
              </DialogTrigger>

              <DialogContent>
                <FormCadastroUsuario onCadastroSucesso={refresh} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex searchbar">
            <div className="flex searchid items-center w-full p-1 justify-between rounded-md bg-[#EFEFEF]">
              <input
                type="search"
                className="p-2 w-full outline-none bg-transparent"
                placeholder="Busque por nome ou id..."
                value={buscaUsuarios}
                onChange={(e) => setBuscaUsuarios(e.target.value)}
              />
              <button className="mr-2">
                <Search />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between w-full mt-3">
            <p> {usuariosExibidos.length} usuários encontrados</p>

            <div className="flex items-center gap-4">
              <OrdenarDropdown
                label="Ordenar por"
                options={opcoesOrdenacaoUsers}
                onSortChange={handleSortUsuarios}
              />

              <FilterDropdown
                filtersConfig={usuariosFilter}
                onApply={aplicarFiltrosUsers}
              />
            </div>
          </div>

          {/* Listagem */}
          <div className="flex flex-col flex-1 items-center w-full mt-4">
            {usuariosExibidos.length > 0 ? (
              /* dados só renderizam a tabela se tiver resultado */
              <TableListagens
                data={usuariosExibidos}
                columns={colunaUsuarioSetor}
                acoesDropdown={(setor) => (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={setor.funcao === "Gestor" ? `/adm/usuarios/gestor/${setor.id_usuario}` : `/adm/usuarios/${setor.id_usuario}`}>
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
                        <FormEdicaoUsuario usuarioId={setor.id_usuario} onEdicaoSucesso={refresh} />
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
                        <FormExclusaoUsuario usuarioId={setor.id_usuario} onExclusaoSucesso={refresh} />
                      </DialogContent>
                    </Dialog>

                  </>
                )}
              />
            ) : (
              /* se não tiver correspondência (length === 0), mostra apenas a div */
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 w-full mt-4">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhum setor encontrado</h2>
                {/* <p>Não encontramos nenhum resultado para "{busca}".</p> */}
              </div>
            )}
          </div>

        </section>



      </div>
    </main>
  );
}
