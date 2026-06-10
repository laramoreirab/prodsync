"use client";

import { useState, useEffect } from "react";
import { Pencil, Plus, X as XIcon, ChevronDown, Loader2 } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { setorCrudService } from "@/services/setorCrudService"; 
import { apiFetch } from "@/lib/api";

export default function FormEdicaoSetor({ setorId, onEdicaoSucesso }) {
    const [carregando, setCarregando] = useState(true);

    // estados das informações básicas
    const [nomeSetor, setNomeSetor] = useState("");          // backend: nome_setor
    const [localizacao, setLocalizacao] = useState("");      // backend: localizacao (somente leitura na edição)

    // estados da máquina
    const [maquinaSelecionada, setMaquinaSelecionada] = useState("");
    const [listaMaquinas, setListaMaquinas] = useState([]);
    const [maquinasDisponiveis, setMaquinasDisponiveis] = useState([]);

    // estados da equipe
    const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
    const [funcaoSelecionada, setFuncaoSelecionada] = useState("");
    const [listaEquipe, setListaEquipe] = useState([]);
    const [usuariosDisponiveis, setUsuariosDisponiveis] = useState([]);

    const tipoUsuario = (usuario) => usuario?.tipo ?? usuario?.funcao;
    const usuariosFiltrados = funcaoSelecionada
        ? usuariosDisponiveis.filter((usuario) => tipoUsuario(usuario) === funcaoSelecionada)
        : usuariosDisponiveis;

    // buscando os dados no banco assim que o modal abre
    useEffect(() => {
        const buscarDadosDoSetor = async () => {
            setCarregando(true);
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

            } catch (error) {
                console.error("Erro ao buscar dados do setor:", error);
                toast.error("Erro ao carregar os dados do setor.");
            } finally {
                setCarregando(false);
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

                {/* máquinas do setor — ids_maquinas (array) */}
                <div>
                    <h2 className="text-2xl font-semibold text-black">2. Máquinas do Setor</h2>
                    <p className="text-xl text-[#545454] font-medium mb-4">Vincule os equipamentos que operarão nesse setor.</p>

                    <div className="flex items-center gap-3">
                        <div className="relative w-full max-w-md">
                            <select
                                value={maquinaSelecionada}
                                onChange={(e) => setMaquinaSelecionada(e.target.value)}
                                className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-gray-400 bg-white shadow-sm text-lg outline-none"
                            >
                                <option value="" disabled>Selecione</option>
                                {maquinasDisponiveis
                                    .filter((maquina) => !maquina.id_setor || String(maquina.id_setor) === String(setorId))
                                    .filter((maquina) => !listaMaquinas.some((item) => String(item.value) === String(maquina.id_maquina)))
                                    .map((maquina) => (
                                        <option key={maquina.id_maquina} value={maquina.id_maquina}>
                                            {maquina.nome}
                                        </option>
                                    ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </div>

                        <button
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
                    <h2 className="text-2xl font-semibold text-black">3. Equipe e Responsabilidades</h2>
                    <p className="text-xl text-[#545454] font-medium mb-4">Adicione os colaboradores e defina suas responsabilidades.</p>

                    <div className="flex items-end gap-3 max-w-4xl">
                        <div className="flex-1">
                            <label className="block text-xl font-medium text-gray-700 mb-1">Selecione o Usuário</label>
                            <div className="relative">
                                <select
                                    value={usuarioSelecionado}
                                    onChange={(e) => setUsuarioSelecionado(e.target.value)}
                                    className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 bg-white focus:outline-none shadow-sm text-gray-400 text-lg"
                                >
                                    <option value="" disabled>Selecione...</option>
                                    {usuariosFiltrados.map((usuario) => (
                                        <option key={usuario.id_usuario} value={usuario.id_usuario}>
                                            {usuario.nome} ({tipoUsuario(usuario)})
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-xl font-medium text-gray-700 mb-1">Definir Função</label>
                            <div className="relative">
                                <select
                                    value={funcaoSelecionada}
                                    onChange={(e) => setFuncaoSelecionada(e.target.value)}
                                    className="w-full appearance-none border text-gray-400 border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-lg bg-white focus:outline-none shadow-sm"
                                >
                                    <option value="" disabled>Selecione....</option>
                                    <option value="Operador">Operador</option>
                                    <option value="Gestor">Gestor</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <button
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
