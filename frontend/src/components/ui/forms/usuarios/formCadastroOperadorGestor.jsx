import { useEffect, useState, useRef } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Info, File, Upload, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { usuariosCrudService } from '@/services/usuariosCrudService';
import { setorCrudService } from '@/services/setorCrudService';
import { apiFetch } from '@/lib/api';
import { deduplicarTurnosParaSelect } from '@/lib/filterUtils';
import { mascaraCPF } from '@/utils/mascaras';

export default function FormCadastroOperadorGestor({ onCadastroSucesso }) {
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const fileInputFotoRef = useRef(null);
    const [listaSetores, setListaSetores] = useState([]);
    const [listaTurnos, setListaTurnos] = useState([]);
    const [listaMaquinas, setListaMaquinas] = useState([]);

    const estadoInicialForm = {
        nome: "",
        cpf: "",
        email: "",
        id_setor: "",   // número — backend: id_setor
        id_turno: "",   // número — backend: id_turno
        id_maquina: ""  // número — backend: id_maquina
    };

    const [formData, setFormData] = useState(estadoInicialForm);

    useEffect(() => {
        async function carregarSetores() {
            try {
                const dados = await setorCrudService.getAll();
                setListaSetores(dados.dados || []);
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar setores.");
            }
        }

        carregarSetores();
    }, []);

    useEffect(() => {
        async function carregarVinculosSetor() {
            if (!formData.id_setor) {
                setListaTurnos([]);
                setListaMaquinas([]);
                return;
            }

            try {
                const [turnos, maquinas] = await Promise.all([
                    apiFetch(`/api/turnos/listarTurnos?id_setor=${formData.id_setor}`, { method: "GET" }),
                    apiFetch(`/api/maquinas/setor/${formData.id_setor}`, { method: "GET" }),
                ]);
                setListaTurnos(deduplicarTurnosParaSelect(turnos.dados || []));
                setListaMaquinas(maquinas.dados || []);
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar turnos e maquinas.");
            }
        }

        carregarVinculosSetor();
    }, [formData.id_setor]);

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
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = new FormData();
        const cpfLimpo = formData.cpf.replace(/\D/g, '');
        //formData.append('campo', value)
        payload.append('nome', formData.nome);
        payload.append('cpf', formData.cpfLimpo);
        payload.append('email', formData.email);
        payload.append('id_setor', formData.id_setor);     // número — backend: id_setor
        payload.append('funcao', 'Operador');
        payload.append('id_turno', formData.id_turno);     // número — backend: id_turno
        payload.append('id_maquina', formData.id_maquina); // número — backend: id_maquina

        if (fotoPerfil?.raw) payload.append("imagem_perfil", fotoPerfil.raw);

        try {
            await usuariosCrudService.create(payload);
            toast.success("Operador criado com sucesso!");
            //limpar formulário após sucesso
            setFormData(estadoInicialForm);
            setFotoPerfil(null);
            if (onCadastroSucesso) onCadastroSucesso();
        } catch (error) {
            console.error("Erro ao criar operador:", error);
            toast.error("Erro ao criar operador.");
        }
    };

    const labelStyle = "text-gray-600 text-sm font-medium mb-1.5 block";
    const inputStyle = "w-full border border-gray-200 rounded-md p-3 text-sm outline-none focus:ring-2 focus:ring-blue-900/10 transition-all";

    return (
        <>
            <div className="title_modal flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Plus className="mr-2 text-3xl text-white" />
                    <DialogTitle className="text-3xl text-white">
                        Criar Operador
                    </DialogTitle>
                </div>
            </div>
            <Separator className="m-2 bg-[#a6a6a6]" />

            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 flex flex-col gap-6">
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
                            onChange={handleInputChange}
                            type="text"
                            className={inputStyle}
                            required />
                    </div>
                    <div>
                        <label htmlFor="cpf" className={labelStyle}>CPF</label>
                        <input
                            id="cpf"
                            onChange={handleInputChange}
                            type="text"
                            className={inputStyle}
                            mascara={mascaraCPF}
                            required />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelStyle}>E-mail</label>
                        <input
                            id="email"
                            onChange={handleInputChange}
                            type="email"
                            className={inputStyle}
                            required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="relative">
                        <label htmlFor="id_setor" className={labelStyle}>Setor</label>
                        <select
                            id="id_setor"
                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white`}
                            required
                        >
                            <option value="">Selecione...</option>
                            {listaSetores.map((setor) => (
                                <option key={setor.id_setor} value={setor.id_setor}>
                                    {setor.nome_setor}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <label htmlFor="id_turno" className={labelStyle}>Turno</label>
                        <select
                            id="id_turno"
                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white`}
                            required
                        >
                            <option value="">Selecione...</option>
                            {listaTurnos.map((turno) => (
                                <option key={turno.id_turno} value={turno.id_turno}>
                                    {turno.nome_turno}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                <div className="relative pt-1">
                    <label htmlFor="id_maquina" className={labelStyle}>Máquina a Gerenciar</label>
                    <select
                        id="id_maquina"
                        onChange={handleInputChange}
                        className={`${inputStyle} appearance-none pr-10 bg-white`}
                        required
                    >
                        <option value="">Selecione...</option>
                        {listaMaquinas.map((maquina) => (
                            <option key={maquina.id_maquina} value={maquina.id_maquina}>
                                {maquina.nome}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                <div className="flex justify-center mt-4">
                    <button type="submit" className="bg-[#002866] text-xl text-white font-semibold py-3 px-10 rounded-lg">
                        Criar
                    </button>
                </div>
            </form>
        </>
    )
}
