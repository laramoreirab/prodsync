import { useState, useRef, useEffect } from 'react';
import {
    DialogTitle,
} from "@/components/ui/dialog";
import { File, Upload, ChevronDown, Pencil, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { usuariosCrudService } from '@/services/usuariosCrudService';
import { mascaraCPF } from '@/utils/mascaras';
import { setorCrudService } from '@/services/setorCrudService';
import { apiFetch } from '@/lib/apiFetch';
import { deduplicarTurnosParaSelect } from '@/utils/deduplicarTurnosParaSelect';


export default function FormEdicaoOperadorGestor({ operadorId, onEdicaoSucesso }) {
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const fileInputFotoRef = useRef(null);

    // Estado de carregamento
    const [carregando, setCarregando] = useState(true);
    const [listaTurnos, setListaTurnos] = useState([])
    const [listaMaquinas, setListaMaquinas] = useState([])
    const [setores, setSetores] = useState([]);

    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        email: "",
        id_setor: "",   // número — backend: id_setor
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
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Buscando os dados no banco assim que o modal abre
    useEffect(() => {
        const buscarDadosDoOperador = async () => {
            setCarregando(true);
            try {
                const dados = await usuariosCrudService.getById(operadorId);

                //preenche os estados com os dados retornados
                setFormData({
                    nome: dados.nome || '',
                    cpf: dados.cpf || '',
                    email: dados.email || '',
                    id_setor: dados.id_setor || '',
                    id_turno: dados.id_turno || '',
                    id_maquina: dados.id_maquina || '',
                });

                //se o operador já tiver uma imagem no banco, configura o preview
                if (dados.imagem_perfil) {
                    setFotoPerfil({
                        nome: 'Imagem atual',
                        preview: dados.imagem_perfil,
                        raw: null
                    });
                }

            } catch (error) {
                console.error("Erro ao buscar detalhes do operador:", error);
                toast.error("Erro ao carregar os dados do operador.");
            } finally {
                setCarregando(false);
            }
        };

        if (operadorId) buscarDadosDoOperador();
    }, [operadorId]);

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
    // A função que vai rodar quando o usuário digitar:
    const handleCpfChange = (e) => {
        const valorMascarado = mascaraCPF(e.target.value);

        // Atualiza o seu estado do formData com o valor já formatado
        setFormData({
            ...formData,
            cpf: valorMascarado
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cpfLimpo = formData.cpf.replace(/\D/g, '');

        const payload = new FormData();
        payload.append('nome', formData.nome);
        payload.append('cpf', cpfLimpo);
        payload.append('email', formData.email);
        payload.append('id_setor', formData.id_setor);     // número — backend: id_setor
        payload.append('funcao', 'operador');              // função SEMPRE será operador!!
        payload.append('id_turno', formData.id_turno);     // número — backend: id_turno
        payload.append('id_maquina', formData.id_maquina); // número — backend: id_maquina
        payload.append('id_usuario', operadorId);          // backend espera id_usuario no body

        // Só anexa a foto se o usuário tiver selecionado uma nova
        if (fotoPerfil?.raw) payload.append("foto", fotoPerfil.raw);

        try {
            await usuariosCrudService.update(operadorId, payload);
            toast.success("Operador atualizado com sucesso!");
            if (onEdicaoSucesso) onEdicaoSucesso();
        } catch (error) {
            console.error("Erro ao editar operador:", error);
            toast.error("Erro ao atualizar operador.");
        }
    };

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
                        Editar Operador
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
                            {/* pré-visualização da imagem */}
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
                            placeholder="Nome completo"
                            required />
                    </div>
                    <div>
                        <label htmlFor="cpf" className={labelStyle}>CPF</label>
                        <input
                            id="cpf"
                            value={formData.cpf}
                            onChange={handleCpfChange}
                            type="text"
                            className={inputStyle}
                            placeholder="000.000.000-00"
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
                            placeholder="usuario@email.com"
                            required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="relative">
                        <label htmlFor="id_setor" className={labelStyle}>Setor</label>
                        <select
                            id="id_setor"
                            value={formData.id_setor}
                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white`}
                            required
                        >
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
                    <div className="relative">
                        <label htmlFor="id_turno" className={labelStyle}>Turno</label>
                        <select
                            id="id_turno"
                            value={formData.id_turno}
                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white`}
                            required
                            disabled={!formData.id_setor}
                        >
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

                <div className="flex justify-center mt-4">
                    <button type="submit" className="bg-[#002866] text-xl text-white font-semibold py-3 px-10 rounded-lg">
                        Editar
                    </button>
                </div>
            </form>
        </>
    );
}