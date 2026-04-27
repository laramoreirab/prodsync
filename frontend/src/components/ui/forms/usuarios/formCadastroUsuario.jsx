import { useState, useRef } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Plus, Info, File, Upload, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';

export default function FormCadastroUsuario() {
    const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [arquivoLote, setArquivoLote] = useState(null);
    const fileInputLoteRef = useRef(null);
    const fileInputFotoRef = useRef(null);


    const estadoInicialForm = {
        nomeUser: "",
        cpfUser: "",
        emailUser: "",
        setorUser: "",
        funcaoUser: "",
        turnoUser: "",
        maquinaUser: ""
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

    const handleSubmitIndividual = async (e) => {
        e.preventDefault();
        const payload = new FormData();
        Object.keys(formData).forEach(key => payload.append(key, formData[key]));
        if (fotoPerfil?.raw) payload.append("foto", fotoPerfil.raw);
    };

    const handleSubmitLote = async (e) => {
        e.preventDefault();
        if (!arquivoLote) return toast.error("Selecione um arquivo CSV!");

        const payloadLote = new FormData();
        payloadLote.append("file", arquivoLote.raw);
    };

    const labelStyle = "text-gray-600 text-sm font-medium mb-1.5 block";
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
                                    <p className="text-[#7c7c81]">O arquivo deve estar em .CSV e cada campo necessita estar corretamente separado por vírgulas. </p>
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
                        <label className={labelStyle}>Nome</label>
                        <input
                            id="nomeUser"

                            onChange={handleInputChange}
                            type="text"
                            className={inputStyle}
                            required />
                    </div>
                    <div>
                        <label className={labelStyle}>CPF</label>
                        <input
                            id="cpfUser"
                            onChange={handleInputChange}
                            type="text" className={inputStyle}
                            required />
                    </div>
                    <div>
                        <label className={labelStyle}>E-mail</label>
                        <input
                            id="emailUser"

                            onChange={handleInputChange}
                            type="email"
                            className={inputStyle}
                            required />
                    </div>

                    {/* Select personalizado com ícone */}
                    <div className="relative">
                        <label className={labelStyle}>Setor</label>
                        <select
                            id="setorUser"

                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white`}
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value="Roscas">Roscas</option>
                            <option value="Brocas">Brocas</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="relative">
                        <label className={labelStyle}>Função</label>
                        <select
                            id="funcaoUser"
                            className={`${inputStyle} appearance-none pr-10 bg-white`}

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
                        <label className={labelStyle}>Turno</label>
                        <select
                            id="turnoUser"

                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white`}
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value="Manhã">Manhã</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Noite">Noite</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Máquina a Gerenciar só aparece se função = operador */}
                {formData.funcaoUser === "Operador" && (
                    <div className="relative pt-1">
                        <label className={labelStyle}>Máquina a Gerenciar</label>
                        <select
                            id="maquinaUser"

                            onChange={handleInputChange}
                            className={`${inputStyle} appearance-none pr-10 bg-white`}
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value="M1">Máquina 1</option>
                            <option value="M2">Máquina 2</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                )}

                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="bg-[#002866] text-xl text-white font-semibold py-3 px-10 rounded-lg"
                    >
                        Criar
                    </button>
                </div>
            </form>
        </>
    )
}