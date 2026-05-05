"use client";

import { useState } from "react";
import { Plus, X as XIcon, ChevronDown } from "lucide-react";
import {
    DialogTitle
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function FormCadastroSetor() {
    //estados da maquina
    const [maquinaSelecionada, setMaquinaSelecionada] = useState("");
    const [listaMaquinas, setListaMaquinas] = useState([]);
    //estados da equipe
    const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
    const [funcaoSelecionada, setFuncaoSelecionada] = useState("");
    const [listaEquipe, setListaEquipe] = useState([]);

    //funções para adicionar e remover máquinas
    const adicionarMaquina = (e) => {
        e.preventDefault(); //evita recarregar a página ao clicar no botão
        if (maquinaSelecionada && !listaMaquinas.includes(maquinaSelecionada)) {
            setListaMaquinas([...listaMaquinas, maquinaSelecionada]);
            setMaquinaSelecionada(""); //reseta o select
        }
    };
    const removerMaquina = (nomeMaquina) => {
        setListaMaquinas(listaMaquinas.filter((m) => m !== nomeMaquina));
    };

    //funções para adicionar e remover colaboradores
    const adicionarColaborador = (e) => {
        e.preventDefault();
        if (usuarioSelecionado && funcaoSelecionada) {
            setListaEquipe([
                ...listaEquipe,
                { usuario: usuarioSelecionado, funcao: funcaoSelecionada }
            ]);
            setUsuarioSelecionado(""); //reseta os selects
            setFuncaoSelecionada("");
        }
    };
    const removerColaborador = (indexParaRemover) => {
        setListaEquipe(listaEquipe.filter((_, index) => index !== indexParaRemover));
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
            <form className="px-8 pb-8 pt-4 flex flex-col gap-6">

                {/* infos básicas */}
                <div>
                    <h2 className="text-2xl font-semibold text-black mb-4">1. Informações Básicas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xl font-medium text-gray-700 mb-1">Nome do Setor</label>
                            <input
                                type="text"
                                placeholder="Usinagem Pesada"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 placeholder-gray-300 outline-none shadow-sm text-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-xl font-medium text-gray-700 mb-1">Localização Física</label>
                            <input
                                type="text"
                                placeholder="Galpão B - Corredor 3"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 placeholder-gray-300 outline-none shadow-sm text-lg"
                            />
                        </div>
                    </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* máquinas do setor */}
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
                                <option value="THAK-2">THAK-2</option>
                                <option value="Torno CNC 100">Torno CNC 100</option>
                                <option value="Fresa Universal">Fresa Universal</option>
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

                    {/* tags das máquinas ja adicionadas */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {listaMaquinas.map((maquina, index) => (
                            <div key={index} className="bg-[#F2F2F2] text-[#333333] font-medium px-3 py-1.5 rounded-md flex items-center gap-2 text-[15px]">
                                <span>{maquina}</span>
                                <button
                                    onClick={(e) => { e.preventDefault(); removerMaquina(maquina); }}
                                    className="text-gray-500 focus:outline-none"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* equipe e responsabilidades */}
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
                                    <option value="Carlos Mendes">Carlos Mendes</option>
                                    <option value="Luis Mariz">Luis Mariz</option>
                                    <option value="Ana Souza">Ana Souza</option>
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

                    {/*tags dos usuarios ja adicionados */}
                    {listaEquipe.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-xl font-medium text-black mb-3">Colaboradores Vinculados:</h4>
                            <div className="flex flex-wrap gap-3">
                                {listaEquipe.map((membro, index) => (
                                    <div key={index} className="bg-[#F2F2F2] text-[#333333] font-medium px-3 py-1.5 rounded-md flex items-center gap-2 text-[15px]">
                                        <span>{membro.usuario} ({membro.funcao})</span>
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
                    <button type="submit" className="bg-[#002866] text-2xl cursor-pointer text-white font-semibold py-3 px-10 rounded-lg ">
                        Criar
                    </button>
                </div>

            </form>
        </>
    )
} 