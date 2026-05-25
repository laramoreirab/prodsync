"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X as XIcon, ChevronDown, Loader2 } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { setorCrudService } from "@/services/setorCrudService";
import { apiFetch } from "@/lib/api";

export default function FormCadastroSetor({ onCadastroSucesso }) {
    const [nomeSetor, setNomeSetor] = useState("");
    const [localizacao, setLocalizacao] = useState("");
    const [maquinaSelecionada, setMaquinaSelecionada] = useState("");
    const [listaMaquinas, setListaMaquinas] = useState([]);
    const [maquinasSelecionadas, setMaquinasSelecionadas] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
    const [funcaoSelecionada, setFuncaoSelecionada] = useState("");
    const [listaEquipe, setListaEquipe] = useState([]);
    const [equipeSelecionada, setEquipeSelecionada] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const submitEmAndamentoRef = useRef(false);

    const tipoUsuario = (usuario) => usuario?.tipo ?? usuario?.funcao;
    const usuariosFiltrados = funcaoSelecionada
        ? listaEquipe.filter((usuario) => tipoUsuario(usuario) === funcaoSelecionada)
        : listaEquipe;

    useEffect(() => {
        async function carregarMaquinas() {
            try {
                const dados = await apiFetch(`/api/maquinas/`, { method: "GET" });
                setListaMaquinas(dados.dados || []);
            } catch (error) {
                console.log(error);
                toast.error("Erro ao carregar maquinas.");
            }
        }
        carregarMaquinas();
    }, []);

    useEffect(() => {
        async function carregarEquipe() {
            try {
                const dados = await apiFetch(`/api/usuarios/listarSemAdms`, { method: "GET" });
                setListaEquipe(dados.dados || []);
            } catch (error) {
                console.log(error);
                toast.error("Erro ao carregar usuarios.");
            }
        }
        carregarEquipe();
    }, []);

    const adicionarMaquina = (e) => {
        e.preventDefault();
        const idMaquina = Number(maquinaSelecionada);
        if (!idMaquina || maquinasSelecionadas.some(m => m.id_maquina === idMaquina)) return;

        const maquina = listaMaquinas.find(m => m.id_maquina === idMaquina);
        if (maquina?.id_setor) {
            toast.error("Esta maquina ja esta vinculada a outro setor.");
            setMaquinaSelecionada("");
            return;
        }
        if (maquina) setMaquinasSelecionadas([...maquinasSelecionadas, maquina]);
        setMaquinaSelecionada("");
    };

    const removerMaquina = (id_maquina) => {
        setMaquinasSelecionadas(maquinasSelecionadas.filter(m => m.id_maquina !== id_maquina));
    };

    const adicionarColaborador = (e) => {
        e.preventDefault();
        const idUsuario = Number(usuarioSelecionado);
        if (!idUsuario || !funcaoSelecionada || equipeSelecionada.some(u => u.id_usuario === idUsuario)) return;

        const usuario = listaEquipe.find(u => u.id_usuario === idUsuario);
        if (funcaoSelecionada === "Gestor" && tipoUsuario(usuario) !== "Gestor") {
            toast.error("Apenas usuarios do tipo Gestor podem ser definidos como gestor do setor.");
            return;
        }

        if (funcaoSelecionada === "Operador" && tipoUsuario(usuario) !== "Operador") {
            toast.error("Apenas usuarios do tipo Operador podem ser definidos como operador do setor.");
            return;
        }

        if (usuario) setEquipeSelecionada([...equipeSelecionada, { ...usuario, funcao: funcaoSelecionada }]);
        setUsuarioSelecionado("");
        setFuncaoSelecionada("");
    };

    const removerColaborador = (indexParaRemover) => {
        setEquipeSelecionada(equipeSelecionada.filter((_, index) => index !== indexParaRemover));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitEmAndamentoRef.current) return;
        submitEmAndamentoRef.current = true;
        setCarregando(true);

        try {
            const novoSetor = await setorCrudService.create({
                nome_setor: nomeSetor,
                localizacao: localizacao,
            });

            if (maquinasSelecionadas.length > 0) {
                await setorCrudService.associarMaquinas(
                    novoSetor.id_setor,
                    maquinasSelecionadas.map(m => m.id_maquina)
                );
            }

            const gestor = equipeSelecionada.find(m => m.funcao === "Gestor");
            if (gestor) {
                await setorCrudService.associarGestor(novoSetor.id_setor, gestor.id_usuario);
            }

            const operadores = equipeSelecionada.filter(m => m.funcao === "Operador");
            if (operadores.length > 0) {
                await setorCrudService.associarOperadores(
                    novoSetor.id_setor,
                    operadores.map(o => o.id_usuario)
                );
            }

            toast.success("Setor criado com sucesso!");
            setNomeSetor("");
            setLocalizacao("");
            setMaquinaSelecionada("");
            setMaquinasSelecionadas([]);
            setUsuarioSelecionado("");
            setFuncaoSelecionada("");
            setEquipeSelecionada([]);
            if (onCadastroSucesso) onCadastroSucesso();
        } catch (error) {
            console.error("Erro ao criar setor:", error);
            toast.error(error.message || "Erro ao criar setor.");
        } finally {
            submitEmAndamentoRef.current = false;
            setCarregando(false);
        }
    };

    return (
        <>
            <div className="flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Plus className="mr-2 text-3xl text-white" />
                    <DialogTitle className="text-3xl text-white">Criar Setor</DialogTitle>
                </div>
            </div>
            <Separator className="m-2 bg-[#a6a6a6]" />
            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">1. Informacoes Basicas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xl font-medium text-gray-700 mb-1 dark:text-slate-300">Nome do Setor</label>
                            <input
                                type="text"
                                value={nomeSetor}
                                onChange={(e) => setNomeSetor(e.target.value)}
                                placeholder="Usinagem Pesada"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 placeholder-gray-300 outline-none shadow-sm text-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-xl font-medium text-gray-700 mb-1 dark:text-slate-300">Localizacao Fisica</label>
                            <input
                                type="text"
                                value={localizacao}
                                onChange={(e) => setLocalizacao(e.target.value)}
                                placeholder="Galpao B - Corredor 3"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 placeholder-gray-300 outline-none shadow-sm text-lg"
                            />
                        </div>
                    </div>
                </div>

                <Separator className="bg-gray-200" />

                <div>
                    <h2 className="text-2xl font-semibold text-black dark:text-white">2. Maquinas do Setor</h2>
                    <p className="text-xl text-[#545454] font-medium mb-4 dark:text-slate-300">Vincule os equipamentos que operarao nesse setor.</p>

                    <div className="flex items-center gap-3">
                        <div className="relative w-full max-w-md">
                            <select
                                value={maquinaSelecionada}
                                onChange={(e) => setMaquinaSelecionada(e.target.value)}
                                className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-gray-400 bg-white shadow-sm text-lg outline-none"
                            >
                                <option value="">Selecione...</option>
                                {listaMaquinas
                                    .filter((maquina) => !maquina.id_setor)
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
                            type="button"
                            onClick={adicionarMaquina}
                            disabled={carregando}
                            className="bg-[#002C6A] hover:bg-[#001f4d] text-white rounded-full w-9 h-9 flex items-center justify-center focus:outline-none transition-colors shrink-0"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {maquinasSelecionadas.map((maquina) => (
                            <div key={maquina.id_maquina} className="bg-[#F2F2F2] text-[#333333] font-medium px-3 py-1.5 rounded-md flex items-center gap-2 text-[15px]">
                                <span>{maquina.nome}</span>
                                <button
                                    onClick={(e) => { e.preventDefault(); removerMaquina(maquina.id_maquina); }}
                                    className="text-gray-500 focus:outline-none"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="bg-gray-200" />

                <div>
                    <h2 className="text-2xl font-semibold text-black dark:text-white">3. Equipe e Responsabilidades</h2>
                    <p className="text-xl text-[#545454] font-medium mb-4 dark:text-slate-300">Adicione os colaboradores e defina suas responsabilidades.</p>

                    <div className="flex items-end gap-3 max-w-4xl">
                        <div className="flex-1">
                            <label className="block text-xl font-medium text-gray-700 mb-1 dark:text-slate-300">Selecione o Usuario</label>
                            <div className="relative">
                                <select
                                    value={usuarioSelecionado}
                                    onChange={(e) => setUsuarioSelecionado(e.target.value)}
                                    className="w-full appearance-none border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 bg-white focus:outline-none shadow-sm text-gray-400 text-lg"
                                >
                                    <option value="">Selecione...</option>
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
                            <label className="block text-xl font-medium text-gray-700 mb-1 dark:text-slate-300">Definir Funcao</label>
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
                            type="button"
                            onClick={adicionarColaborador}
                            disabled={carregando}
                            className="bg-[#002C6A] hover:bg-[#001f4d] text-white rounded-full w-9 h-9 flex items-center justify-center focus:outline-none transition-colors shrink-0 mb-0.5"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    {equipeSelecionada.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-xl font-medium text-black mb-3 dark:text-slate-300">Colaboradores Vinculados:</h4>
                            <div className="flex flex-wrap gap-3">
                                {equipeSelecionada.map((membro, index) => (
                                    <div key={membro.id_usuario} className="bg-[#F2F2F2] text-[#333333] font-medium px-3 py-1.5 rounded-md flex items-center gap-2 text-[15px]">
                                        <span>{membro.nome} ({membro.funcao})</span>
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
                    <button
                        type="submit"
                        disabled={carregando}
                        className="bg-[#002866] text-2xl cursor-pointer text-white font-semibold py-3 px-10 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {carregando && <Loader2 className="h-5 w-5 animate-spin" />}
                        {carregando ? "Criando..." : "Criar"}
                    </button>
                </div>
            </form>
        </>
    );
}
