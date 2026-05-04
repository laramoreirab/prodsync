import { useState, useRef } from 'react';
import { Plus, Upload, File } from "lucide-react";
import {
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { maquinaCrudService } from '@/services/maquinaCrudService'; 

export default function FormCadastroMaquina({ onCadastroSucesso }) {
    const [arquivo, setArquivo] = useState(null);
    const fileInputRef = useRef(null);

    //estados para os campos do form
    const [nome, setNome] = useState('');
    const [idSetor, setIdSetor] = useState('');      
    const [idCategoria, setIdCategoria] = useState(''); 
    const [serie, setSerie] = useState('');
    // campos pendentes pro backend adicionar:
    const [capacidade, setCapacidade] = useState('');
    const [status, setStatus] = useState('');
    const [dataAquisicao, setDataAquisicao] = useState('');
    const [operador, setOperador] = useState('');

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
        //formData.append('campo', value)
        formData.append('nome', nome);
        formData.append('id_setor', idSetor);        
        formData.append('id_categoria', idCategoria);
        formData.append('serie', serie);
        // campos pendentes pro backend adicionar:
        formData.append('capacidade', capacidade);
        formData.append('status', status);
        formData.append('dataAquisicao', dataAquisicao);
        formData.append('operador', operador);

        if (arquivo && arquivo.raw) {
            formData.append('imagem', arquivo.raw);
        }

        try {
            await maquinaCrudService.create(formData);
            toast.success("Máquina cadastrada com sucesso!");
            //limpar formulário ou fecha modal
            setNome('');
            setIdSetor('');
            setIdCategoria('');
            setSerie('');
            setCapacidade('');
            setStatus('');
            setDataAquisicao('');
            setOperador('');
            setArquivo(null);
            if (onCadastroSucesso) {
                onCadastroSucesso();
            }
        } catch (error) {
            console.error("Erro ao cadastrar máquina:", error);
            toast.error("Erro ao cadastrar máquina.");
        }
    };

    return (
        <>
            <DialogContent className="top-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-none rounded-b-lg">
                <div className="flex items-center">
                    <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                        <Plus className="mr-2 text-3xl text-white" />
                        <DialogTitle className="text-3xl text-white">Cadastrar Máquina</DialogTitle>
                    </div>
                </div>
                <Separator className="m-2 bg-[#a6a6a6]" />

                <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 flex flex-col gap-6">
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
                            <label className="text-md text-cinza-escuro">Nome</label>
                            <input
                                id="nome"
                                type="text"
                                placeholder=""
                                className="border rounded-md p-2.5 outline-none"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-md text-cinza-escuro">Número de Série</label>
                            <input
                                id="serie"
                                type="text"
                                className="border rounded-md p-2.5 outline-none"
                                value={serie}
                                onChange={(e) => setSerie(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-md text-cinza-escuro">Setor</label>
                            <select
                                id="id_setor"
                                className="border rounded-md p-2.5 outline-none bg-white"
                                value={idSetor}
                                onChange={(e) => setIdSetor(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                <option value="1">Engrenagens</option>
                                <option value="2">Roscas</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-md text-cinza-escuro">Tipo de Máquina</label>
                            <select
                                id="id_categoria"
                                className="border rounded-md p-2.5 outline-none bg-white"
                                value={idCategoria}
                                onChange={(e) => setIdCategoria(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                <option value="1">Tipo A</option>
                            </select>
                        </div>

                        {/* campos pendentes pro backend adicionar */}
                        <div className="flex flex-col gap-1">
                            <label className="text-md text-cinza-escuro">Capacidade Normal</label>
                            <input
                                id="capacidade"
                                type="text"
                                className="border rounded-md p-2.5 outline-none"
                                value={capacidade}
                                onChange={(e) => setCapacidade(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-md text-cinza-escuro">Data de Aquisição</label>
                            <input
                                id="dataAquisicao"
                                type="date"
                                className="border rounded-md p-2.5 outline-none"
                                value={dataAquisicao}
                                onChange={(e) => setDataAquisicao(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-md text-cinza-escuro">Status de Máquina</label>
                            <select
                                id="status"
                                className="border rounded-md p-2.5 outline-none bg-white"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                <option value="Produzindo">Produzindo</option>
                                <option value="Parada">Parada</option>
                                <option value="Manutencao">Manutenção</option>
                                <option value="Setup">Setup</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-md text-cinza-escuro">Operador</label>
                            <select
                                id="operador"
                                className="border rounded-md p-2.5 outline-none bg-white"
                                value={operador}
                                onChange={(e) => setOperador(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                <option value="João">João</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button type="submit" className="bg-[#002866] text-xl text-white font-semibold py-3 px-10 rounded-lg ">
                            Cadastrar
                        </button>
                    </div>
                </form>
            </DialogContent>
        </>
    )
}