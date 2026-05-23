import { useState, useRef, useEffect } from 'react';
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

export default function FormCadastroUsuario({ onCadastroSucesso }) {
    const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [arquivoLote, setArquivoLote] = useState(null);
    const fileInputLoteRef = useRef(null);
    const fileInputFotoRef = useRef(null);
    const [listaSetores, setListaSetores] = useState([])
    const [listaTurnos, setListaTurnos] = useState([])
    const [listaMaquinas, setListaMaquinas] = useState([])

    useEffect(() => {
        async function carregarSetores() {
            try {
                const dados = await setorCrudService.getAll();
                setListaSetores(dados.dados);
            } catch (error) {
                console.log(error)
                toast.error("Erro ao carregar setores.");
            }

        }

        carregarSetores();
    }, []);


    const estadoInicialForm = {
        nome: "",
        cpf: "",
        email: "",
        id_setor: "",   // número — backend: id_setor
        funcao: "",
        id_turno: "",   // número — backend: id_turno
        id_maquina: ""  // número — backend: id_maquina
    };

    const [formData, setFormData] = useState(estadoInicialForm);

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

    const handleLoteChange = (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.csv')) {
            setArquivoLote({
                raw: file,
                nome: file.name
            });
        } else {
            toast.error("Selecione um arquivo CSV válido.");
            if (fileInputLoteRef.current) fileInputLoteRef.current.value = "";
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const mascaraCPF = (valor) => {
        return valor
            .replace(/\D/g, "") // Remove tudo o que não é número
            .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o primeiro ponto
            .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // Coloca o traço
            .substring(0, 14); // Garante que não passe de 14 caracteres
    };

    // A função que vai rodar quando o usuário digitar:
    const handleCpfChange = (e) => {
        const valorMascarado = mascaraCPF(e.target.value);

        // Atualiza o seu estado do formData com o valor já formatado
        setFormData({
            ...formData,
            cpf: valorMascarado
        });
    };

    const handleSubmitIndividual = async (e) => {
        e.preventDefault();

        const payload = new FormData();
        const cpfLimpo = formData.cpf.replace(/\D/g, '');
        //formData.append('campo', value)
        payload.append('nome', formData.nome);
        payload.append('cpf', formData.cpfLimpo);
        payload.append('email', formData.email);
        payload.append('id_setor', formData.id_setor);     // número — backend: id_setor
        payload.append('funcao', formData.funcao);
        payload.append('id_turno', formData.id_turno);     // número — backend: id_turno
        payload.append('id_maquina', formData.id_maquina); // número — backend: id_maquina

        if (fotoPerfil?.raw) payload.append("imagem_perfil", fotoPerfil.raw);

        try {
            await usuariosCrudService.create(payload);
            toast.success("Usuário criado com sucesso!");
            //limpar formulário após sucesso
            setFormData(estadoInicialForm);
            setFotoPerfil(null);
            if (onCadastroSucesso) onCadastroSucesso();
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            toast.error("Erro ao criar usuário.");
        }
    };

    const handleSubmitLote = async (e) => {
        e.preventDefault();
        if (!arquivoLote) return toast.error("Selecione um arquivo CSV!");

        const payloadLote = new FormData();
        payloadLote.append("file", arquivoLote.raw);

        //integrar endpoint de cadastro em lote quando o backend disponibilizar
    };

    useEffect(() => {
        async function carregarTurnos() {
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
            try {
                const options = { method: "GET" }
                const dados = await apiFetch(`/api/maquinas/setor/${formData.id_setor}`, options)
                setListaMaquinas(dados.dados);
            } catch (error) {
                console.log(error)
                toast.error("Erro ao carregar setores.");
            }

        }

        carregarMaquinas();
    }, [formData.id_setor]);

    const labelStyle = "text-gray-600 text-sm font-medium mb-1.5 block dark:text-slate-300";
    const inputStyle = "w-full border border-gray-200 rounded-md p-3 text-sm outline-none focus:ring-2 focus:ring-blue-900/10 transition-all";

    return (
        <>
            <div className="title_modal flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Plus className="mr-2 text-3xl text-white" />
                    <DialogTitle className="text-3xl text-white">
                        Criar Usuário
                    </DialogTitle>
                </div>
            </div>
            <Separator className="m-2 bg-[#a6a6a6]" />

            <form onSubmit={handleSubmitIndividual} className="px-8 pb-8 pt-4 flex flex-col gap-6">
                <div className="flex justify-end">
                    <Dialog open={isLoteModalOpen} onOpenChange={setIsLoteModalOpen}>
                        <DialogTrigger className="bg-secondary-foreground px-4 py-2 rounded-md flex items-center text-white text-xl font-semibold">
                            <Plus className="mr-2" />
                            Criar em Lote
                        </DialogTrigger>

                        <DialogContent>
                            <div className="flex items-center">
                                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                                    <Plus className="mr-2 text-3xl text-white" />
                                    <DialogTitle className="text-3xl text-white">Criar Usuários em Lote</DialogTitle>
                                </div>
                            </div>
                            <Separator className="m-2 bg-[#a6a6a6]" />

                            <div className="px-8 pb-8 pt-4 flex flex-col gap-6">
                                <input
                                    type="file"
                                    ref={fileInputLoteRef}
                                    onChange={handleLoteChange}
                                    accept=".csv"
                                    className="hidden"
                                />

                                {/* div do upload clicavel */}
                                <div
                                    onClick={() => fileInputLoteRef.current?.click()}
                                    className="border-2 border-dashed rounded-xl p-7 flex flex-col items-center justify-center bg-white border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    {!arquivoLote ? (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <Upload className="w-12 h-12 mb-2 text-gray-400" />
                                            <span className="text-md font-medium">Clique aqui para fazer upload do arquivo CSV.</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center w-full">
                                            <div className="flex items-center bg-[#aebfdb] text-[#4a5f82] px-3 py-2 rounded-md w-full">
                                                <File className="w-4 h-4 mr-2 shrink-0" />
                                                <span className="text-sm truncate">{arquivoLote.nome}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <Info className="text-[#7c7c81] mr-2" />
                                    <p className="text-[#7c7c81]">O arquivo deve estar em .CSV e cada campo necessita estar corretamente separado por vírgulas.</p>
                                </div>

                                <div className="flex justify-center mt-4">
                                    <button type="button" onClick={handleSubmitLote} className="bg-[#002866] text-xl text-white font-semibold py-3 px-10 rounded-lg">
                                        Criar em Lote
                                    </button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

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
                            onChange={handleCpfChange}
                            type="text"
                            className={inputStyle}
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
                    <div className="relative">
                        <label htmlFor="id_setor" className={labelStyle}>Setor</label>
                        <select
                            id="id_setor"
                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white text-gray-400`}
                            required
                        >
                            <option value="">Selecione...</option>
                            {listaSetores.map((setor) => (

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
                            className={`${inputStyle} appearance-none pr-10 bg-white text-gray-400`}
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
                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white text-gray-400`}
                            disable={!formData.id_setor}
                            required
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

                {/* máquina a gerenciar só aparece se função = operador */}
                {formData.funcao === "Operador" && (
                    <div className="relative pt-1">
                        <label htmlFor="id_maquina" className={labelStyle}>Máquina a Gerenciar</label>
                        <select
                            id="id_maquina"
                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white`}
                            disable={!formData.id_setor}
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
                        Criar
                    </button>
                </div>
            </form>
        </>
    )
}