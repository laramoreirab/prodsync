import { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Pencil, File, Upload, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';

export default function FormEdicaoUsuario() {
    const [fotoPerfil, setFotoPerfil] = useState(null);
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

    const labelStyle = "text-gray-600 text-sm font-medium mb-1.5 block";
    const inputStyle = "w-full border border-gray-200 rounded-md p-3 text-sm outline-none focus:ring-2 focus:ring-blue-900/10 transition-all";


    return (
        <>
            <DialogContent className="rounded-lg">
                <div className="title_modal flex items-center">
                    <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                        <Pencil className="mr-2 text-3xl text-white" />
                        <DialogTitle className="text-3xl text-white">
                            Editar Usuário
                        </DialogTitle>
                    </div>
                </div>
                <Separator className="my-2" />
                <form className="px-8 pb-8 pt-4 flex flex-col gap-6">
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
                            <label >Nome</label>
                            <input
                                id="nomeUser"
                                value={formData.nomeUser}
                                onChange={handleInputChange}
                                type="text"
                                className={inputStyle}
                                required />
                        </div>
                        <div>
                            <label >CPF</label>
                            <input
                                id="cpfUser"
                                value={formData.cpfUser}
                                onChange={handleInputChange}
                                type="text"
                                className={inputStyle}
                                required />
                        </div>
                        <div>
                            <label >E-mail</label>
                            <input
                                id="emailUser"
                                value={formData.emailUser}
                                onChange={handleInputChange}
                                type="email"
                                className={inputStyle}
                                required />
                        </div>

                        {/* Select personalizado com ícone */}
                        <div className="relative">
                            <label >Setor</label>
                            <select
                                id="setorUser"
                                value={formData.setorUser}
                                onChange={handleInputChange}
                                className={`${inputStyle} appearance-none pr-10 bg-white`}
                                required>
                                <option value="">Selecione...</option>
                                <option value="Roscas">Roscas</option>
                                <option value="Brocas">Brocas</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="relative">
                            <label >Função</label>
                            <select
                                id="funcaoUser"
                                className={`${inputStyle} appearance-none pr-10 bg-white`}
                                value={formData.funcaoUser}
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
                            <label >Turno</label>
                            <select
                                id="turnoUser"
                                value={formData.turnoUser}
                                onChange={handleInputChange}
                                className={`${inputStyle} appearance-none pr-10 bg-white`}
                                required>
                                <option value="">Selecione...</option>
                                <option value="Manha">Manhã</option>
                                <option value="Tarde">Tarde</option>
                                <option value="Noite">Noite</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-9.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Máquina a Gerenciar só aparece se função = operador */}
                    {formData.funcaoUser === "Operador" && (
                        <div className="relative pt-1">
                            <label >Máquina a Gerenciar</label>
                            <select
                                id="maquinaUser"
                                value={formData.maquinaUser}
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
                        <button type="submit" className="bg-[#002866] text-xl text-white font-semibold py-3 px-10 rounded-lg">
                            Editar
                        </button>
                    </div>
                </form>

            </DialogContent>
        </>
    );
};