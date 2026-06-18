"use client"

import { useState, useRef, useEffect } from 'react';
import { Pencil, Upload, File, Loader2 } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { maquinaCrudService } from '@/services/maquinaCrudService';
import { setorCrudService } from '@/services/setorCrudService';
import { apiFetch } from '@/lib/api';
import FormSelect from "@/components/ui/FormSelect";
import { deduplicarPorCampo, deduplicarUsuarios } from '@/lib/filterUtils';

const resolverImagemMaquina = (imagem) => {
    if (!imagem) return null;
    if (imagem.startsWith("http")) return imagem;

    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    if (imagem.startsWith("/uploads/")) return `${apiUrl}${imagem}`;

    const nomeArquivo = imagem.replaceAll("\\", "/").split("/").pop();
    return `${apiUrl}/uploads/imagens/${nomeArquivo}`;
};

export default function FormEdicaoMaquina({ maquinaId, onEdicaoSucesso }) {
    const [arquivo, setArquivo] = useState(null);
    const fileInputRef = useRef(null);

    // Estados para gerenciar os dados do formulário
    const [maquinaCompleta, setMaquinaCompleta] = useState(null);
    const [carregando, setSincronizando] = useState(true);

    // Estados dos campos (para serem controlados)
    // campos que o backend aceita no update:
    const [nome, setNome] = useState('');
    const [serie, setSerie] = useState('');
    // campos pendentes pro backend adicionar:
    const [idSetor, setIdSetor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [status, setStatus] = useState('');
    const [operador, setOperador] = useState('');
    const [setores, setSetores] = useState([]);
    const [operadores, setOperadores] = useState([]);

    useEffect(() => {
        async function carregarSetores() {
            try {
                const response = await setorCrudService.getAll();
                const lista = Array.isArray(response) ? response : (response.dados || []);
                setSetores(deduplicarPorCampo(lista, 'id_setor'));
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
                const response = await apiFetch(`/api/usuarios/operadores/${idSetor}`, options)
                const lista = Array.isArray(response) ? response : (response.dados || []);
                setOperadores(deduplicarUsuarios(lista));
            } catch (error) {
                console.log(error)
                toast.error("Erro ao carregar operadores atrelados ao Setor");
            }
        }

        carregar();
    }, [idSetor]);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

            if (!tiposPermitidos.includes(file.type)) {
                toast.error("Formato inválido! Por favor, envie apenas JPG, PNG ou WEBP.");
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

    // Buscando os dados no banco assim que o modal abre
    useEffect(() => {
        const buscarDadosDaMaquina = async () => {
            setSincronizando(true);
            try {
                const resposta = await maquinaCrudService.getById(maquinaId);
                const dados = resposta.dados || resposta;

                setMaquinaCompleta(dados);

                // Preenchendo os estados com os dados retornados
                setNome(dados.nome || '');
                setSerie(dados.serie || '');
                // campos pendentes pro backend adicionar:
                setIdSetor(dados.id_setor || '');
                setCategoria(dados.categoria || '');
                setCapacidade(dados.capacidade || '');
                setStatus(dados.status_atual || dados.status || '');
                setOperador(dados.id_operador || '');

                // Se a máquina já tiver uma imagem no banco, você pode configurar o preview aqui
                if (dados.imagem) {
                    setArquivo({
                        nome: 'Imagem atual',
                        preview: resolverImagemMaquina(dados.imagem),
                        raw: null
                    });
                }

            } catch (error) {
                console.error("Erro ao buscar detalhes da máquina:", error);
                toast.error("Erro ao carregar os dados da máquina.");
            } finally {
                setSincronizando(false);
            }
        };

        if (maquinaId) {
            buscarDadosDaMaquina();
        }
    }, [maquinaId]);

    // Função que lida com o envio do form usando FormData
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('serie', serie);
        // campos pendentes pro backend adicionar:
        formData.append('id_setor', idSetor);
        formData.append('categoria', categoria);
        formData.append('capacidade', capacidade);
        formData.append('status_atual', status);
        formData.append('id_operador', operador);

        // Só anexa a imagem se o usuário tiver selecionado um novo arquivo
        if (arquivo && arquivo.raw) {
            formData.append('imagem', arquivo.raw);
        }

        try {
            await maquinaCrudService.update(maquinaId, formData);
            toast.success("Máquina atualizada com sucesso!");

            if (onEdicaoSucesso) {
                onEdicaoSucesso();
            }

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error("Erro ao atualizar máquina:", error);
            toast.error("Erro ao atualizar os dados.");
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
            <div className="title_modal flex items-center">
                <div className="text-secondary flex items-center px-4 py-2 rounded-md">
                    <Pencil strokeWidth={2.8} className="mr-2" size={30} />
                    <DialogTitle className="text-3xl font-semibold">
                        Editar Máquina
                    </DialogTitle>
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

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-6">
                    <div className="flex flex-col gap-1">
                        <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">Nome</label>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="border shadow-md mt-1 border-gray-200 rounded-md p-3 outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">ID</label>
                        <input
                            disabled
                            id="idMaquina"
                            type="number"
                            value={maquinaId}
                            className="bg-gray-100 cursor-not-allowed border shadow-md mt-1 border-gray-200 rounded-md p-3 outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">Número de Série</label>
                        <input
                            id="serie"
                            type="text"
                            value={serie}
                            onChange={(e) => setSerie(e.target.value)}
                            className="border shadow-md mt-1 border-gray-200 rounded-md p-3 outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">Data de Aquisição</label>
                        <input
                            disabled
                            id="dataAquisicao"
                            type="date"
                            value={maquinaCompleta?.data_aquisicao ? maquinaCompleta.data_aquisicao.split('T')[0] : ''}
                            className="border shadow-md mt-1 border-gray-200 rounded-md p-3 outline-none bg-gray-100 cursor-not-allowed opacity-70"
                        />
                    </div>

                    <FormSelect
                        key={`select-setor`}
                        id="id_setor"
                        label="Setor"
                        options={setores}
                        valueKey="id_setor"
                        labelKey="nome_setor"
                        value={idSetor}
                        onValueChange={(val) => { setIdSetor(val); setOperador(''); }}
                    />

                    <div className="flex flex-col gap-1">
                        <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">Tipo de Máquina</label>
                        <input
                            id="categoria"
                            type="text"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className="border shadow-md mt-1 border-gray-200 rounded-md p-3 outline-none bg-white"
                        >
                        </input>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="block text-lg text-gray-700 font-medium dark:text-slate-300">Capacidade Normal</label>
                        <input
                            id="capacidade"
                            type="text"
                            value={capacidade}
                            onChange={(e) => setCapacidade(e.target.value)}
                            className="border shadow-md mt-1 border-gray-200 rounded-md p-3 outline-none"
                        />
                    </div>

                    <FormSelect
                        id="status"
                        label="Status de Máquina"
                        options={[
                            { value: "Produzindo", label: "Produzindo" },
                            { value: "Parada", label: "Parada" },
                            { value: "Setup", label: "Setup" }
                        ]}
                        value={status}
                        onValueChange={(val) => setStatus(val)}
                    />

                    <FormSelect
                        key={`select-operador-${idSetor}`}
                        id="operador"
                        label="Operador"
                        className="col-span-2"
                        options={operadores}
                        valueKey="id_operador"
                        labelKey="nome"
                        value={operador}
                        onValueChange={(val) => setOperador(val)}
                        disabled={!idSetor}
                    />
                </div>

                <div className="flex justify-center mt-4">
                    <button type="submit" className="cursor-pointer bg-[#002866] hover:bg-[#003891] hover:scale-105 transition-all text-xl text-white font-semibold py-3 px-10 rounded-lg">
                        Editar
                    </button>
                </div>
            </form>
        </>
    )
}
