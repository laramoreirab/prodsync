"use client";

import { useState, useEffect } from "react";
import { Pencil, Plus, X as XIcon, ChevronDown, Loader2 } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { setorCrudService } from "@/services/setorCrudService"; 
import { apiFetch } from "@/lib/api";
import FormSelect from "@/components/ui/FormSelect";

export default function FormEdicaoSetor({ setorId, onEdicaoSucesso }) {
    const [carregando, setSincronizando] = useState(true);

    // estados das informações básicas
    const [nomeSetor, setNomeSetor] = useState("");          // backend: nome_setor
    const [localizacao, setLocalizacao] = useState("");      // backend: localizacao (somente leitura na edição)

    // estados da máquina
    const [maquinaSelecionada, setMaquinaSelecionada] = useState("");
    const [listaMaquinas, setListaMaquinas] = useState([]);
    const [maquinasDisponiveis, setMaquinasDisponiveis] = useState([]);

    // estados dos turnos
    const [turnoSelecionado, setTurnoSelecionado] = useState("");
    const [listaTurnos, setListaTurnos] = useState([]);
    const [turnosDisponiveis, setTurnosDisponiveis] = useState([]);
    const [turnoEditandoKey, setTurnoEditandoKey] = useState(null);
    const [diasTurnoEditando, setDiasTurnoEditando] = useState([]);
    const [inicioTurnoEditando, setInicioTurnoEditando] = useState("");
    const [fimTurnoEditando, setFimTurnoEditando] = useState("");
    const [salvandoTurno, setSalvandoTurno] = useState(false);

    // estados da equipe
    const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
    const [funcaoSelecionada, setFuncaoSelecionada] = useState("");
    const [listaEquipe, setListaEquipe] = useState([]);
    const [usuariosDisponiveis, setUsuariosDisponiveis] = useState([]);

    const tipoUsuario = (usuario) => usuario?.tipo ?? usuario?.funcao;
    const usuariosFiltrados = funcaoSelecionada
        ? usuariosDisponiveis.filter((usuario) => tipoUsuario(usuario) === funcaoSelecionada)
        : usuariosDisponiveis;

    const formatarHorario = (valor) => {
        if (!valor) return "--:--";
        return new Date(valor).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    };

    const diasSemanaOrdem = {
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
        Domingo: 7,
    };

    const diasSemanaAbreviados = {
        Segunda: "Seg",
        Segunda_feira: "Seg",
        Terca: "Ter",
        Terça: "Ter",
        Terca_feira: "Ter",
        Quarta: "Qua",
        Quarta_feira: "Qua",
        Quinta: "Qui",
        Quinta_feira: "Qui",
        Sexta: "Sex",
        Sexta_feira: "Sex",
        Sabado: "Sáb",
        Sábado: "Sáb",
        Domingo: "Dom",
    };

    const diasSemanaEdicao = [
        { valor: "Segunda", label: "Seg" },
        { valor: "Terca", label: "Ter" },
        { valor: "Quarta", label: "Qua" },
        { valor: "Quinta", label: "Qui" },
        { valor: "Sexta", label: "Sex" },
        { valor: "Sabado", label: "Sáb" },
        { valor: "Domingo", label: "Dom" },
    ];

    const extrairHoraInput = (valor) => {
        if (!valor) return "";
        const data = new Date(valor);
        if (Number.isNaN(data.getTime())) return "";
        return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    };

    const getTurnoGrupoKey = (turno) => [
        turno?.nome_turno,
        turno?.hora_inicio,
        turno?.hora_fim,
    ].join("|");

    const getTurnoKey = (turno) => [
        turno?.nome_turno,
        turno?.hora_inicio,
        turno?.hora_fim,
        turno?.dia_semana,
    ].join("|");

    const agruparTurnosPorHorario = (turnos) => {
        const grupos = new Map();

        for (const turno of turnos) {
            const key = getTurnoGrupoKey(turno);
            const grupo = grupos.get(key) ?? {
                key,
                nome_turno: turno.nome_turno,
                hora_inicio: turno.hora_inicio,
                hora_fim: turno.hora_fim,
                ids: [],
                dias: [],
            };

            if (!grupo.dias.some((dia) => dia.valor === turno.dia_semana)) {
                grupo.dias.push({
                    valor: turno.dia_semana,
                    label: diasSemanaAbreviados[turno.dia_semana] ?? String(turno.dia_semana || ""),
                    ordem: diasSemanaOrdem[turno.dia_semana] ?? 99,
                });
            }

            if (!grupo.ids.includes(String(turno.id_turno))) {
                grupo.ids.push(String(turno.id_turno));
            }

            grupos.set(key, grupo);
        }

        return Array.from(grupos.values()).map((grupo) => {
            const dias = grupo.dias
                .sort((a, b) => a.ordem - b.ordem)
                .map((dia) => dia.label);
            const horario = `${formatarHorario(grupo.hora_inicio)} - ${formatarHorario(grupo.hora_fim)}`;

            return {
                ...grupo,
                label: `${grupo.nome_turno || "Turno"} - ${dias.join(", ")} (${horario})`,
            };
        });
    };

    const turnosDisponiveisAgrupados = agruparTurnosPorHorario(
        Array.from(new Map(turnosDisponiveis.map((turno) => [getTurnoKey(turno), turno])).values())
    );

    // buscando os dados no banco assim que o modal abre
    useEffect(() => {
        const buscarDadosDoSetor = async () => {
            setSincronizando(true);
            try {
                const resposta = await setorCrudService.getById(setorId);
                const dados = resposta.dados || resposta;

                // Preenchendo os estados com os dados retornados
                setNomeSetor(dados.nome_setor || '');
                setLocalizacao(dados.localizacao || '');
                setListaMaquinas((dados.maquinas || []).map((maquina) => ({
                    label: maquina.nome,
                    value: String(maquina.id_maquina)
                })));
                setListaTurnos(agruparTurnosPorHorario(dados.turnos || []));

            } catch (error) {
                console.error("Erro ao buscar dados do setor:", error);
                toast.error("Erro ao carregar os dados do setor.");
            } finally {
                setSincronizando(false);
            }
        };

        if (setorId) buscarDadosDoSetor();
    }, [setorId]);

    useEffect(() => {
        async function carregarMaquinas() {
            try {
                const dados = await apiFetch(`/api/maquinas/`, { method: "GET" });
                setMaquinasDisponiveis(dados.dados || []);
            } catch (error) {
                console.log(error);
                toast.error("Erro ao carregar maquinas.");
            }
        }
        carregarMaquinas();
    }, []);

    useEffect(() => {
        async function carregarTurnos() {
            try {
                const dados = await apiFetch(`/api/turnos/listarTurnos`, { method: "GET" });
                setTurnosDisponiveis(dados.dados || []);
            } catch (error) {
                console.log(error);
                toast.error("Erro ao carregar turnos.");
            }
        }
        carregarTurnos();
    }, []);

    useEffect(() => {
        async function carregarUsuarios() {
            try {
                const dados = await apiFetch(`/api/usuarios/listarSemAdms`, { method: "GET" });
                setUsuariosDisponiveis(dados.dados || []);
            } catch (error) {
                console.log(error);
                toast.error("Erro ao carregar usuarios.");
            }
        }
        carregarUsuarios();
    }, []);

    // funções para adicionar e remover máquinas
    const adicionarMaquina = (e) => {
        e.preventDefault();
        if (maquinaSelecionada && !listaMaquinas.find(m => m.value === maquinaSelecionada)) {
            const maquina = maquinasDisponiveis.find((item) => String(item.id_maquina) === String(maquinaSelecionada));
            if (maquina?.id_setor && String(maquina.id_setor) !== String(setorId)) {
                toast.error("Esta maquina ja esta vinculada a outro setor.");
                setMaquinaSelecionada("");
                return;
            }

            if (maquina) {
                setListaMaquinas([...listaMaquinas, {
                    label: maquina.nome,
                    value: String(maquina.id_maquina)
                }]);
            }
            setMaquinaSelecionada("");
        }
    };
    const removerMaquina = (value) => {
        setListaMaquinas(listaMaquinas.filter((m) => m.value !== value));
    };

    const adicionarTurno = (e) => {
        e.preventDefault();
        if (!turnoSelecionado) return;

        const grupo = turnosDisponiveisAgrupados.find((item) => item.key === turnoSelecionado);
        if (!grupo) return;

        if (listaTurnos.some((item) => item.key === grupo.key)) {
            setTurnoSelecionado("");
            return;
        }

        setListaTurnos([...listaTurnos, grupo]);
        setTurnoSelecionado("");
    };

    const removerTurno = (key) => {
        setListaTurnos(listaTurnos.filter((turno) => turno.key !== key));
    };

    const abrirEditorTurno = (turno) => {
        if (turnoEditandoKey === turno.key) {
            setTurnoEditandoKey(null);
            return;
        }

        setTurnoEditandoKey(turno.key);
        setDiasTurnoEditando(turno.dias.map((dia) => dia.valor));
        setInicioTurnoEditando(extrairHoraInput(turno.hora_inicio));
        setFimTurnoEditando(extrairHoraInput(turno.hora_fim));
    };

    const alternarDiaTurno = (dia) => {
        setDiasTurnoEditando((diasAtuais) => (
            diasAtuais.includes(dia)
                ? diasAtuais.filter((item) => item !== dia)
                : [...diasAtuais, dia]
        ));
    };

    const salvarEdicaoTurno = async (e, turno) => {
        e.preventDefault();
        e.stopPropagation();

        if (diasTurnoEditando.length === 0) {
            toast.error("Selecione pelo menos um dia para o turno.");
            return;
        }

        if (!inicioTurnoEditando || !fimTurnoEditando) {
            toast.error("Informe os horários de início e fim.");
            return;
        }

        setSalvandoTurno(true);
        try {
            const resposta = await setorCrudService.atualizarGrupoTurno(setorId, {
                ids_turnos: turno.ids.map(Number),
                dias_semana: diasTurnoEditando,
                hora_inicio: inicioTurnoEditando,
                hora_fim: fimTurnoEditando,
            });

            const turnos = resposta.dados || [];
            setListaTurnos(agruparTurnosPorHorario(turnos));

            const turnosAtualizados = await apiFetch(`/api/turnos/listarTurnos`, { method: "GET" });
            setTurnosDisponiveis(turnosAtualizados.dados || []);

            setTurnoEditandoKey(null);
            toast.success("Turno atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar turno:", error);
            toast.error(error.message || "Erro ao atualizar turno.");
        } finally {
            setSalvandoTurno(false);
        }
    };

    // funções para adicionar e remover colaboradores
    const adicionarColaborador = (e) => {
        e.preventDefault();
        const idUsuario = Number(usuarioSelecionado);
        if (idUsuario && funcaoSelecionada && !listaEquipe.some(u => u.id_usuario === idUsuario)) {
            const usuario = usuariosDisponiveis.find(u => u.id_usuario === idUsuario);

            if (funcaoSelecionada === "Gestor" && tipoUsuario(usuario) !== "Gestor") {
                toast.error("Apenas usuarios do tipo Gestor podem ser definidos como gestor do setor.");
                return;
            }

            if (funcaoSelecionada === "Operador" && tipoUsuario(usuario) !== "Operador") {
                toast.error("Apenas usuarios do tipo Operador podem ser definidos como operador do setor.");
                return;
            }

            if (usuario) {
                setListaEquipe([
                    ...listaEquipe,
                    { ...usuario, funcao: funcaoSelecionada }
                ]);
                setUsuarioSelecionado("");
                setFuncaoSelecionada("");
            }
        }
    };
    const removerColaborador = (indexParaRemover) => {
        setListaEquipe(listaEquipe.filter((_, index) => index !== indexParaRemover));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // atualizar o setor — campo: nome_setor (id vai na URL)
            await setorCrudService.update(setorId, {
                nome_setor: nomeSetor, // backend: nome_setor
            });

            // associar máquinas se houver — ids_maquinas (array), id do setor na URL
            if (listaMaquinas.length > 0) {
                await setorCrudService.associarMaquinas(
                    setorId,
                    listaMaquinas.map(m => Number(m.value))
                );
            }

            // sincronizar turnos do setor — ids_turnos (array), id do setor na URL
            await setorCrudService.sincronizarTurnos(
                setorId,
                listaTurnos.flatMap((turno) => turno.ids.map(Number))
            );

            // associar gestor se houver — id_gestor no body, id do setor na URL
            const gestor = listaEquipe.find(m => m.funcao === "Gestor");
            if (gestor) {
                await setorCrudService.associarGestor(setorId, gestor.id_usuario);
            }

            toast.success("Setor atualizado com sucesso!");
            if (onEdicaoSucesso) onEdicaoSucesso();
        } catch (error) {
            console.error("Erro ao atualizar setor:", error);
            toast.error(error.message || "Erro ao atualizar setor.");
        }
    };

    if (carregando) {
        return (
            <div className="flex flex-col items-center justify-center p-20 min-h-100">
                <Loader2 className="w-10 h-10 animate-spin text-blue-900 mb-4" />
                <p className="text-lg text-gray-600 font-medium">Buscando dados...</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center">
                <div className="text-secondary flex items-center px-4 py-2 rounded-md">
                    <Pencil strokeWidth={2.8} className="mr-2" size={30} />
                    <DialogTitle className="text-3xl font-semibold">Editar Setor</DialogTitle>
                </div>
            </div>

            <Separator className="m-2 bg-[#a6a6a6]" />

            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 flex flex-col gap-6 text-gray-800">

                {/* infos gerais — nome_setor */}
                <div>
                    <h2 className="text-2xl font-semibold text-black mb-4">1. Informações Básicas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xl font-medium text-gray-700 mb-1">Nome do Setor</label>
                            <input
                                type="text"
                                value={nomeSetor}
                                onChange={(e) => setNomeSetor(e.target.value)}
                                placeholder="Usinagem Pesada"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 placeholder-gray-300 outline-none shadow-sm text-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-xl font-medium text-gray-700 mb-1">Localização Física</label>
                            <input
                                type="text"
                                value={localizacao}
                                disabled
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-400 placeholder-gray-300 outline-none shadow-sm text-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* turnos do setor */}
                <div>
                    <h2 className="text-2xl font-semibold text-black">2. Turnos</h2>
                    <p className="text-xl text-[#545454] font-medium mb-4">Vincule os turnos que operarão nesse setor.</p>

                    <div className="flex items-center gap-3">
                        <FormSelect
                            className="max-w-md"
                            options={turnosDisponiveisAgrupados.filter((turno) => !listaTurnos.some((item) => item.key === turno.key))}
                            value={turnoSelecionado}
                            onValueChange={(val) => setTurnoSelecionado(val)}
                            valueKey="key"
                        />

                        <button
                            type="button"
                            onClick={adicionarTurno}
                            className="bg-[#002C6A] hover:bg-[#001f4d] text-white rounded-full w-9 h-9 flex items-center justify-center focus:outline-none transition-colors shrink-0"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        {listaTurnos.map((turno) => (
                            <div key={turno.key} className="w-full">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => abrirEditorTurno(turno)}
                                        className="bg-[#F2F2F2] text-[#333333] font-medium px-3 py-1.5 rounded-md flex items-center gap-2 text-[15px] text-left focus:outline-none"
                                    >
                                        <span>{turno.label}</span>
                                        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${turnoEditandoKey === turno.key ? "rotate-180" : ""}`} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removerTurno(turno.key); }}
                                        className="text-gray-500 focus:outline-none"
                                    >
                                        <XIcon className="h-4 w-4" />
                                    </button>
                                </div>

                                {turnoEditandoKey === turno.key && (
                                    <div className="mt-2 w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                        <div className="mb-4">
                                            <p className="text-base font-semibold text-gray-700 mb-2">Dias de operação</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {diasSemanaEdicao.map((dia) => (
                                                    <label key={dia.valor} className="flex min-w-[70px] items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-2 text-sm font-medium text-gray-700">
                                                        <input
                                                            type="checkbox"
                                                            checked={diasTurnoEditando.includes(dia.valor)}
                                                            onChange={() => alternarDiaTurno(dia.valor)}
                                                            className="h-4 w-4 shrink-0 accent-[#002C6A]"
                                                        />
                                                        {dia.label}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-base font-medium text-gray-700 mb-1">Início</label>
                                                <input
                                                    type="time"
                                                    value={inicioTurnoEditando}
                                                    onChange={(e) => setInicioTurnoEditando(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none shadow-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-base font-medium text-gray-700 mb-1">Fim</label>
                                                <input
                                                    type="time"
                                                    value={fimTurnoEditando}
                                                    onChange={(e) => setFimTurnoEditando(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setTurnoEditandoKey(null)}
                                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => salvarEdicaoTurno(e, turno)}
                                                disabled={salvandoTurno}
                                                className="rounded-lg bg-[#002C6A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                            >
                                                {salvandoTurno ? "Salvando..." : "Salvar"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* máquinas do setor — ids_maquinas (array) */}
                <div>
                    <h2 className="text-2xl font-semibold text-black">3. Máquinas do Setor</h2>
                    <p className="text-xl text-[#545454] font-medium mb-4">Vincule os equipamentos que operarão nesse setor.</p>

                    <div className="flex items-center gap-3">
                        <FormSelect
                            className="max-w-md"
                            options={maquinasDisponiveis
                                .filter((maquina) => !maquina.id_setor || String(maquina.id_setor) === String(setorId))
                                .filter((maquina) => !listaMaquinas.some((item) => String(item.value) === String(maquina.id_maquina)))}
                            value={maquinaSelecionada}
                            onValueChange={(val) => setMaquinaSelecionada(val)}
                        />

                        <button
                            type="button"
                            onClick={adicionarMaquina}
                            className="bg-[#002C6A] hover:bg-[#001f4d] text-white rounded-full w-9 h-9 flex items-center justify-center focus:outline-none transition-colors shrink-0"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    {/* tags das máquinas já adicionadas */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {listaMaquinas.map((maquina) => (
                            <div key={maquina.value} className="bg-[#F2F2F2] text-[#333333] font-medium px-3 py-1.5 rounded-md flex items-center gap-2 text-[15px]">
                                <span>{maquina.label}</span>
                                <button
                                    onClick={(e) => { e.preventDefault(); removerMaquina(maquina.value); }}
                                    className="text-gray-500 focus:outline-none"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* equipe e responsabilidades — id_gestor */}
                <div>
                    <h2 className="text-2xl font-semibold text-black">4. Equipe e Responsabilidades</h2>
                    <p className="text-xl text-[#545454] font-medium mb-4">Adicione os colaboradores e defina suas responsabilidades.</p>

                    <div className="flex items-end gap-3 max-w-4xl">
                        <FormSelect
                            label="Selecione o Usuário"
                            options={usuariosFiltrados}
                            value={usuarioSelecionado}
                            onValueChange={(val) => setUsuarioSelecionado(val)}
                        />

                        <FormSelect
                            label="Definir Função"
                            options={[
                                { value: "Operador", label: "Operador" },
                                { value: "Gestor", label: "Gestor" }
                            ]}
                            value={funcaoSelecionada}
                            onValueChange={(val) => setFuncaoSelecionada(val)}
                        />

                        <button
                            type="button"
                            onClick={adicionarColaborador}
                            className="bg-[#002C6A] hover:bg-[#001f4d] text-white rounded-full w-9 h-9 flex items-center justify-center focus:outline-none transition-colors shrink-0 mb-0.5"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    {/* tags dos usuários já adicionados */}
                    {listaEquipe.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-xl font-medium text-black mb-3">Colaboradores Vinculados:</h4>
                            <div className="flex flex-wrap gap-3">
                                {listaEquipe.map((membro, index) => (
                                    <div key={index} className="bg-[#F2F2F2] text-[#333333] font-medium px-3 py-1.5 rounded-md flex items-center gap-2 text-[15px]">
                                        <span>{membro.nome ?? membro.usuario} ({membro.funcao})</span>
                                        <button
                                            onClick={(e) => { e.preventDefault(); removerColaborador(index); }}
                                            className="text-gray-500 hover:text-red-500 focus:outline-none"
                                        >
                                            <XIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-4">
                    <button type="submit" className="cursor-pointer bg-[#002866] hover:bg-[#003891] hover:scale-105 transition-all text-xl text-white font-semibold py-3 px-10 rounded-lg">
                        Editar
                    </button>
                </div>
            </form>
        </>
    );
}
