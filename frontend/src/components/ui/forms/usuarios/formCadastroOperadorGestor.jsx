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
import FormSelect from "@/components/ui/FormSelect";

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

        const payload = new FormData();
        const cpfLimpo = formData.cpf.replace(/\D/g, '');
        //formData.append('campo', value)
        payload.append('nome', formData.nome);
        payload.append('cpf', cpfLimpo);
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

    const labelStyle = "block text-lg text-gray-700 font-medium dark:text-slate-300";
    const inputStyle = "w-full border shadow-md mt-1 border-gray-200 rounded-md p-2.5 outline-none";

    return (
        <>
            <div className="title_modal flex items-center">
                <div className="text-secondary flex items-center px-4 py-2 rounded-md">
                    <Plus strokeWidth={2.8} className="mr-4" size={30} />
                    <DialogTitle className="font-semibold text-3xl">
                        Criar Operador
                    </DialogTitle>
                </div>
            </div>
            <Separator className="m-2 bg-[#a6a6a6]" />

            <form onSubmit={handleSubmit} className="px-8 py-4 flex flex-col gap-6">
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
                            value={formData.nome}
                            placeholder="Nome completo"
                            required />
                    </div>
                    <div>
                        <label htmlFor="cpf" className={labelStyle}>CPF</label>
                        <input
                            id="cpf"
                            onChange={handleCpfChange}
                            type="text"
                            className={inputStyle}
                            placeholder="000.000.000-00"
                            value={formData.cpf}
                            required />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelStyle}>E-mail</label>
                        <input
                            id="email"
                            onChange={handleInputChange}
                            type="email"
                            className={inputStyle}
                            placeholder="usuario@email.com"
                            value={formData.email}
                            required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <FormSelect
                        id="id_setor"
                        label="Setor"
                        options={listaSetores}
                        value={formData.id_setor}
                        onValueChange={(val) => handleInputChange({ target: { id: "id_setor", value: val } })}
                        required
                    />

                    <FormSelect
                        id="id_turno"
                        label="Turno"
                        options={listaTurnos}
                        value={formData.id_turno}
                        onValueChange={(val) => handleInputChange({ target: { id: "id_turno", value: val } })}
                        required
                    />
                </div>

                <FormSelect
                    id="id_maquina"
                    label="Máquina a Gerenciar"
                    options={listaMaquinas}
                    value={formData.id_maquina}
                    onValueChange={(val) => handleInputChange({ target: { id: "id_maquina", value: val } })}
                    required
                />

                <div className="flex justify-center mt-4">
                    <button type="submit" className="cursor-pointer bg-[#002866] hover:bg-[#003891] hover:scale-105 transition-all text-xl text-white font-semibold py-3 px-8 rounded-lg">
                        Criar
                    </button>
                </div>
            </form>
        </>
    )
}
