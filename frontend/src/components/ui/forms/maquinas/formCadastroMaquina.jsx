import { useState, useRef, useEffect } from 'react';
import { Plus, Upload, File, Info } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { maquinaCrudService } from '@/services/maquinaCrudService';
import { setorCrudService } from '@/services/setorCrudService';
import { apiFetch } from '@/lib/api';


export default function FormCadastroMaquina({ onCadastroSucesso }) {
    const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);
    const [arquivo, setArquivo] = useState(null);
    const [arquivoLote, setArquivoLote] = useState(null);
    const fileInputRef = useRef(null);
    const fileInputLoteRef = useRef(null);

    //estados para os campos do form
    const [nome, setNome] = useState('');
    const [idSetor, setIdSetor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [serie, setSerie] = useState('');
    // campos pendentes pro backend adicionar:
    const [capacidade, setCapacidade] = useState('');
    const [status, setStatus] = useState('');
    const [dataAquisicao, setDataAquisicao] = useState('');
    const [operador, setOperador] = useState('');
    const [setores, setSetores] = useState([]);
    const [operadores, setOperadores] = useState([]);

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
        async function carregar() {
            try {
                if (!idSetor) {
                    setOperadores([]);
                    return;
                }
                const options = { method: "GET" };
                const dados = await apiFetch(`/api/usuarios/operadores/${idSetor}`, options)
                console.log(dados)
                setOperadores(dados.dados);
            } catch (error) {
                console.log(error)
                toast.error("Erro ao carregar operadores atrelados ao Setor");
            }
        }

        carregar();
    }, [idSetor]);

    //abre a seleção de arquivos
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    //tratamento e validação da imagem
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

            if (!tiposPermitidos.includes(file.type)) {
                toast.error("Formato inválido! Envie apenas JPG, PNG ou WEBP.");
                e.target.value = "";
                return;
            }

            setArquivo({
                nome: file.name,
                preview: URL.createObjectURL(file),
                raw: file
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nome', nome.trim());
        formData.append('categoria', categoria.trim());

        if (idSetor) formData.append('id_setor', idSetor);
        if (serie.trim()) formData.append('serie', serie.trim());
        if (capacidade.trim()) formData.append('capacidade', capacidade.trim());
        if (status) formData.append('status_atual', status);
        if (dataAquisicao) formData.append('data_aquisicao', dataAquisicao);
        if (operador) formData.append('id_operador', operador);

        if (arquivo && arquivo.raw) {
            formData.append('imagem', arquivo.raw);
        }
        try {
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            await maquinaCrudService.create(formData);
            toast.success("Máquina cadastrada com sucesso!");
            //limpar formulário ou fecha modal
            setNome('');
            setIdSetor('');
            setCategoria('');
            setSerie('');
            setCapacidade('');
            setStatus('');
            setDataAquisicao('');
            setOperador('');
            setArquivo(null);
            setOperadores([]);
            if (onCadastroSucesso) {
                onCadastroSucesso();
            }
        } catch (error) {
            console.error("Erro ao cadastrar máquina:", error);
            toast.error(error.message || "Erro ao cadastrar máquina.");
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

    const handleSubmitLote = async (e) => {
        e.preventDefault();
        if (!arquivoLote) return toast.error("Selecione um arquivo CSV!");

        const payloadLote = new FormData();
        payloadLote.append("file", arquivoLote.raw);

        try {
            const resposta = await apiFetch('/api/maquinas/cadastro-lote', {
                method: "POST",
                body: payloadLote
            })
            if (resposta && resposta.sucesso !== false) {
                toast.success("Usuários importados com sucesso!");
            }
            setArquivoLote(null);
            if (fileInputLoteRef.current) fileInputLoteRef.current.value = "";

            setIsLoteModalOpen(false);

            if (onCadastroSucesso) onCadastroSucesso();
            else {
                toast.error(response.mensagem || "Erro ao processar o arquivo CSV.");
            }
        } catch (error) {
            console.error("Erro no upload em lote:", error);
            toast.error("Erro interno ao enviar o arquivo para o servidor.");
        }
    };

    return (
        <>
            <DialogContent className="top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none rounded-b-lg">
                <div className="flex items-center">
                    <div className="text-secondary flex items-center px-4 py-2 rounded-md">
                        <Plus strokeWidth={2} size={30} className="mr-2" />
                        <DialogTitle className="text-3xl font-semibold">
                            Cadastrar Máquina
                        </DialogTitle>
                    </div>
                </div>
                <Separator className="m-2 bg-[#a6a6a6]" />

                <div className="px-8 pb-8 pt-4 flex flex-col gap-6">
                    <div className="flex justify-end">
                        <Dialog open={isLoteModalOpen} onOpenChange={setIsLoteModalOpen}>
                            <DialogTrigger className="bg-secondary-foreground px-4 py-2 rounded-md flex items-center text-white text-xl font-semibold">
                                <Plus strokeWidth={2.5} className="mr-2 text-xl" />
                                Criar em Lote
                            </DialogTrigger>

                            <DialogContent>
                                <div className="flex items-center">
                                    <div className="text-secondary flex items-center px-4 py-2 rounded-md">
                                        <Plus className="mr-2 text-3xl text-white" />
                                        <DialogTitle className="text-3xl text-white">Criar Máquinas em Lote</DialogTitle>
                                    </div>
                                </div>
                                <Separator className="m-2 bg-[#a6a6a6]" />


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

                            </DialogContent>
                        </Dialog>
                    </div>


                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".jpg, .jpeg, .png, .webp, image/jpeg, image/png, image/webp"
                            className="hidden"
                        />
                        {/* div do upload clicavel */}
                        <div
                            onClick={handleUploadClick}
                            className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-white border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            {!arquivo ? (
                                <div className="flex flex-col items-center text-gray-500">
                                    <Upload className="w-12 h-12 mb-2 text-gray-400" />
                                    <span className="text-md font-medium">Clique aqui para fazer upload da imagem.</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center w-full">
                                    {/*pré-visualização da Imagem */}
                                    <img
                                        src={arquivo.preview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-lg mb-2 border"
                                    />
                                    <div className="flex items-center bg-[#aebfdb] text-[#4a5f82] px-3 py-2 rounded-md w-full">
                                        <File className="w-4 h-4 mr-2 shrink-0" />
                                        <span className="text-sm truncate">{arquivo.nome}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <div className="flex flex-col gap-1">
                                <label className=" block text-lg text-gray-700 font-medium dark:text-slate-300">Nome</label>
                                <input
                                    id="nome"
                                    type="text"
                                    placeholder=""
                                    className="border shadow-md mt-1 border-gray-200 rounded-md p-2.5 outline-none"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">Número de Série</label>
                                <input
                                    id="serie"
                                    type="text"
                                    className="border shadow-md mt-1 border-gray-200 rounded-md p-2.5 outline-none"
                                    value={serie}
                                    onChange={(e) => setSerie(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">Setor</label>
                                <select
                                    id="id_setor"
                                    className="border shadow-md  border-gray-200 rounded-md p-3 outline-none text-gray-400 text-md font-medium"
                                    value={idSetor}
                                    onChange={(e) => { setIdSetor(e.target.value); setOperador(''); }}
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
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">Tipo de Máquina</label>
                                <input
                                    id="categoria"
                                    type="text"
                                    placeholder=""
                                    className="border shadow-md mt-1 border-gray-200 rounded-md p-2.5 outline-none"
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                >
                                </input>
                            </div>

                            {/* campos pendentes pro backend adicionar */}
                            <div className="flex flex-col gap-1">
                                <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">Capacidade Normal</label>
                                <input
                                    id="capacidade"
                                    type="text"
                                    className="border shadow-md mt-1 border-gray-200 rounded-md p-2.5 outline-none"
                                    value={capacidade}
                                    onChange={(e) => setCapacidade(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">Data de Aquisição</label>
                                <input
                                    id="dataAquisicao"
                                    type="date"
                                    className="border shadow-md mt-1 border-gray-200 rounded-md p-2.5 outline-none"
                                    value={dataAquisicao}
                                    onChange={(e) => setDataAquisicao(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">Status de Máquina</label>
                                <select
                                    id="status"
                                    className="border shadow-md mt-1 border-gray-200 rounded-md p-3 outline-none"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Parada">Parada</option>
                                    <option value="Setup">Setup</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">Operador</label>
                                <select
                                    id="operador"
                                    className="border shadow-md mt-1 border-gray-200 rounded-md p-3 outline-none"
                                    value={operador}
                                    onChange={(e) => setOperador(e.target.value)}
                                    disabled={!idSetor}
                                >
                                    <option value="">Selecione...</option>
                                    {operadores.map((operador) => (

                                        <option
                                            key={operador.id_operador}
                                            value={operador.id_operador}
                                        >
                                            {operador.nome}
                                        </option>

                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-center mt-4">
                            <button type="submit" className="bg-[#002866] text-xl text-white font-semibold py-3 px-8 rounded-lg ">
                                Cadastrar
                            </button>
                        </div>
                    </form>
                </div>

            </DialogContent>
        </>
    )
}
