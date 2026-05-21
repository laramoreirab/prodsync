"use client";

import { useState, useRef, useEffect } from 'react';
import {
    DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, File, Upload, ChevronDown, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { usuariosCrudService } from '@/services/usuariosCrudService'; // Importar o serviço
import { setorCrudService } from '@/services/setorCrudService';
import { apiFetch } from '@/lib/api';
import { deduplicarTurnosParaSelect } from '@/lib/filterUtils';

export default function FormEdicaoUsuario({ usuarioId, onEdicaoSucesso }) {
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const fileInputFotoRef = useRef(null);
    const [setores, setSetores] = useState([]);
    const [listaTurnos, setListaTurnos] = useState([])
    const [listaMaquinas, setListaMaquinas] = useState([])

    // Estados para gerenciar os dados do formulário
    const [carregando, setCarregando] = useState(true);

    // Estados dos campos (para serem controlados)
    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        email: "",
        id_setor: "",   // número — backend: id_setor
        funcao: "",
        id_turno: "",   // número — backend: id_turno
        id_maquina: ""  // número — backend: id_maquina
    });

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFotoPerfil({
                raw: file,
                preview: URL.createObjectURL(file),
                nome: file.name
            });
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        setFormData(prev => {
            const novoEstado = { ...prev, [id]: value };

            // Se mudou o setor, zera o turno e a máquina anteriores para evitar conflito de IDs
            if (id === "id_setor") {
                novoEstado.id_turno = "";
                novoEstado.id_maquina = "";
            }

            // Se a função virar Gestor, remove máquina para não enviar valor antigo
            if (id === "funcao" && value !== "Operador") {
                novoEstado.id_maquina = "";
            }

            return novoEstado;
        });
    };

    // Buscando os dados no banco assim que o modal abre
    useEffect(() => {
        const buscarDadosDoUsuario = async () => {
            setCarregando(true);
            try {
                const dados = await usuariosCrudService.getById(usuarioId);

                // Preenchendo os estados com os dados retornados
                setFormData({
                    nome: dados.nome || '',
                    cpf: dados.cpf || '',
                    email: dados.email || '',
                    id_setor: dados.id_setor != null ? String(dados.id_setor) : '',
                    funcao: dados.funcao || '',
                    id_turno: dados.id_turno != null ? String(dados.id_turno) : '',
                    id_maquina: dados.id_maquina != null ? String(dados.id_maquina) : '',
                });

                // Se o usuário já tiver uma imagem no banco, você pode configurar o preview aqui
                if (dados.imagem_perfil) {
                    setFotoPerfil({
                        nome: 'Imagem atual',
                        preview: dados.imagem_perfil,
                        raw: null
                    });
                }

            } catch (error) {
                console.error("Erro ao buscar detalhes do usuário:", error);
                toast.error("Erro ao carregar os dados do usuário.");
            } finally {
                setCarregando(false);
            }
        };

        if (usuarioId) buscarDadosDoUsuario();
    }, [usuarioId]);

    useEffect(() => {
        async function carregarSetores() {
            try {
                const dados = await setorCrudService.getAll();
                setSetores(dados.dados);
            } catch (error) {
                console.log(error)
                toast.error("Erro ao carregar setores.");
            }

        }

        carregarSetores();
    }, []);

    // Função que lida com o envio do form usando FormData
    const handleSubmitIndividual = async (e) => {
        e.preventDefault();

        const payload = new FormData();
        payload.append('nome', formData.nome);
        payload.append('cpf', formData.cpf);
        payload.append('email', formData.email);
        payload.append('id_setor', formData.id_setor);     // número — backend: id_setor
        payload.append('funcao', formData.funcao);

        if (formData.id_turno) {
            payload.append('id_turno', formData.id_turno);     // número — backend: id_turno
        }
        if (formData.id_maquina) {
            payload.append('id_maquina', formData.id_maquina); // número — backend: id_maquina
        }

        payload.append('id_usuario', usuarioId);           // backend espera id_usuario no body

        // Só anexa a foto se o usuário tiver selecionado uma nova
        if (fotoPerfil?.raw) payload.append("imagem_perfil", fotoPerfil.raw);

        try {
            await usuariosCrudService.update(usuarioId, payload);
            toast.success("Usuário atualizado com sucesso!");
            if (onEdicaoSucesso) onEdicaoSucesso();
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            toast.error("Erro ao atualizar os dados.");
        }
    };

    useEffect(() => {
        async function carregarTurnos() {
            if (!formData.id_setor) {
                setListaTurnos([]);
                return;
            }
            try {
                const options = { method: "GET" }
                const dados = await apiFetch(`/api/turnos/listarTurnos?id_setor=${formData.id_setor}`, options)
                setListaTurnos(deduplicarTurnosParaSelect(dados.dados || []));
            } catch (error) {
                console.log(error)
                toast.error("Erro ao carregar turnos.");
            }

        }

        carregarTurnos();
    }, [formData.id_setor]);

    useEffect(() => {
        async function carregarMaquinas() {
            const idSetor = formData.id_setor;
            if (!idSetor) {
                setListaMaquinas([]);
                return;
            }
            try {
                const options = { method: "GET" }
                const dados = await apiFetch(`/api/maquinas/setor/${idSetor}`, options)
                setListaMaquinas(dados.dados);
            } catch (error) {
                console.log(error)
                toast.error("Erro ao carregar máquinas.");
            }

        }
        carregarMaquinas();
    }, [formData.id_setor]);

    const labelStyle = "text-gray-600 text-sm font-medium mb-1.5 block";
    const inputStyle = "w-full border border-gray-200 rounded-md p-3 text-sm outline-none focus:ring-2 focus:ring-blue-900/10 transition-all";

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
            <div className="title_modal flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Pencil className="mr-2 text-3xl text-white" />
                    <DialogTitle className="text-3xl text-white">
                        Editar Usuário
                    </DialogTitle>
                </div>
            </div>
            <Separator className="my-2" />
            <form onSubmit={handleSubmitIndividual} className="px-8 pb-8 pt-4 flex flex-col gap-6">
                <input
                    type="file"
                    ref={fileInputFotoRef}
                    onChange={handleFotoChange}
                    accept=".jpg, .jpeg, .png, .webp, image/jpeg, image/png, image/webp"
                    className="hidden"
                />

                {/* div do upload clicavel */}
                <div
                    onClick={() => fileInputFotoRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-7 flex flex-col items-center justify-center bg-white border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                    {!fotoPerfil ? (
                        <div className="flex flex-col items-center text-gray-500">
                            <Upload className="w-12 h-12 mb-2 text-gray-400" />
                            <span className="text-md font-medium">Clique aqui para fazer upload da imagem.</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full">
                            {/*pré-visualização da imagem */}
                            <img
                                src={fotoPerfil.preview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg mb-2 border"
                            />
                            <div className="flex items-center bg-[#aebfdb] text-[#4a5f82] px-3 py-2 rounded-md w-full">
                                <File className="w-4 h-4 mr-2 shrink-0" />
                                <span className="text-sm truncate">{fotoPerfil.nome}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-5">
                    <div>
                        <label htmlFor="nome" className={labelStyle}>Nome</label>
                        <input
                            id="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            type="text"
                            className={inputStyle}
                            required />
                    </div>
                    <div>
                        <label htmlFor="cpf" className={labelStyle}>CPF</label>
                        <input
                            id="cpf"
                            value={formData.cpf}
                            onChange={handleInputChange}
                            type="text"
                            className={inputStyle}
                            required />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelStyle}>E-mail</label>
                        <input
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            type="email"
                            className={inputStyle}
                            required />
                    </div>

                    {/* Select personalizado com ícone */}
                    <div className="relative">
                        <label htmlFor="id_setor" className={labelStyle}>Setor</label>
                        <select
                            id="id_setor"
                            value={formData.id_setor}
                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white`}
                            required>
                            <option value="">Selecione...</option>
                            {setores.map((setor) => (

                                <option
                                    key={setor.id_setor}
                                    value={setor.id_setor}
                                >
                                    {setor.nome_setor}
                                </option>

                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="relative">
                        <label htmlFor="funcao" className={labelStyle}>Função</label>
                        <select
                            id="funcao"
                            className={`${inputStyle} appearance-none pr-10 bg-white`}
                            value={formData.funcao}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value="Operador">Operador</option>
                            <option value="Gestor">Gestor</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <label htmlFor="id_turno" className={labelStyle}>Turno</label>
                        <select
                            id="id_turno"
                            value={formData.id_turno}
                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white`}
                            disabled={!formData.id_setor}
                            required>
                            <option value="">Selecione...</option>
                            {listaTurnos.map((turno) => (

                                <option
                                    key={turno.id_turno}
                                    value={turno.id_turno}
                                >
                                    {turno.nome_turno}
                                </option>

                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* máquina a Gerenciar só aparece se função = operador */}
                {formData.funcao === "Operador" && (
                    <div className="relative pt-1">
                        <label htmlFor="id_maquina" className={labelStyle}>Máquina a Gerenciar</label>
                        <select
                            id="id_maquina"
                            value={formData.id_maquina}
                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white`}
                            disabled={!formData.id_setor}
                            required
                        >
                            <option value="">Selecione...</option>
                            {listaMaquinas.map((maquina) => (

                                <option
                                    key={maquina.id_maquina}
                                    value={maquina.id_maquina}
                                >
                                    {maquina.nome}
                                </option>

                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                )}

                <div className="flex justify-center mt-4">
                    <button type="submit" className="bg-[#002866] text-xl text-white font-semibold py-3 px-10 rounded-lg">
                        Editar
                    </button>
                </div>
            </form>
        </>
    );
};
