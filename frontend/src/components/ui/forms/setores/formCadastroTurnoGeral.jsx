import { useState, useRef, useEffect } from 'react';
import { DialogTitle } from "@/components/ui/dialog";
import { Plus, ChevronDown, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import turnoCrudService from '@/services/turnoCrudService';
import { setorCrudService } from '@/services/setorCrudService';

const DIAS_DA_SEMANA = [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
];

export default function FormCadastroTurnoGeral({ onSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const [diasSelecionados, setDiasSelecionados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [setores, setSetores] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        async function carregarSetores() {
            try {
                const resp = await setorCrudService.getAll();
                setSetores(resp?.dados || []);
            } catch {
                toast.error('Erro ao carregar setores');
            }
        }
        carregarSetores();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDia = (dia) => {
        setDiasSelecionados((prev) =>
            prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
        );
    };

    const removerDia = (dia) => {
        setDiasSelecionados((prev) => prev.filter((d) => d !== dia));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const nome = formData.get('nome');
        const inicio = formData.get('horario_inicio');
        const fim = formData.get('horario_fim');

        if (diasSelecionados.length === 0) {
            toast.error('Selecione pelo menos um dia da semana');
            return;
        }

        if (setores.length === 0) {
            toast.error('Nenhum setor cadastrado para receber o turno');
            return;
        }

        setLoading(true);
        try {
            const payloadBase = {
                nome_turno: nome,
                hora_inicio: inicio,
                hora_fim: fim,
                dias_semana: diasSelecionados,
            };

            const resultados = await Promise.all(
                setores.map((setor) =>
                    turnoCrudService.create({ ...payloadBase, id_setor: setor.id_setor })
                )
            );

            const falhas = resultados.filter((r) => !r?.sucesso);
            if (falhas.length > 0) {
                toast.error(`Turno criado em ${resultados.length - falhas.length} de ${setores.length} setores`);
            } else {
                toast.success(`Turno criado em todos os ${setores.length} setores!`);
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Erro ao criar turno geral:', error);
            toast.error('Erro de conexão com o servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Plus className="mr-2 text-3xl text-white" />
                    <DialogTitle className="text-3xl text-white">Criar Turno (Todos os Setores)</DialogTitle>
                </div>
            </div>
            <Separator className="m-2 bg-[#a6a6a6]" />

            <p className="px-8 text-gray-600 dark:text-slate-300">
                O turno será cadastrado em cada setor da empresa ({setores.length} setor(es)).
            </p>

            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="nome" className="text-xl font-medium text-[#545454] dark:text-white">Nome</label>
                    <input type="text" id="nome" name="nome" className="w-full border border-[#e0e0e0] rounded-md px-3 py-2.5 text-xl text-[#333] dark:text-gray-300 outline-none focus:border-[#a0a0a0]" required />
                </div>

                <div className="flex flex-col gap-1.5" ref={dropdownRef}>
                    <label className="text-xl font-medium text-[#545454] dark:text-white">Dias de Operação</label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full bg-white border border-[#e0e0e0] rounded-md px-3 py-2.5 text-xl text-[#545454] outline-none flex justify-between items-center"
                        >
                            <span>Selecione...</span>
                            <ChevronDown className="w-5 h-5 text-[#d0d0d0]" />
                        </button>
                        {isOpen && (
                            <div className="w-full mt-1 bg-white border border-[#e0e0e0] rounded-md max-h-48 overflow-y-auto py-1">
                                {DIAS_DA_SEMANA.map((dia) => (
                                    <label key={dia} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-xl text-[#333]">
                                        <input
                                            type="checkbox"
                                            checked={diasSelecionados.includes(dia)}
                                            onChange={() => toggleDia(dia)}
                                            className="w-4 h-4 accent-blue-900"
                                        />
                                        {dia}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    {diasSelecionados.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {diasSelecionados.map((dia) => (
                                <div key={dia} className="bg-[#f2f2f2] text-[#333] px-3 py-1.5 rounded-md text-sm flex items-center gap-2 font-medium">
                                    {dia}
                                    <button type="button" onClick={() => removerDia(dia)} className="text-[#888] hover:text-[#333]">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label htmlFor="inicio" className="text-xl font-medium text-[#545454] dark:text-white">Horário de Início</label>
                        <input type="time" id="inicio" name="horario_inicio" className="w-full border border-[#e0e0e0] rounded-md py-2.5 px-2 text-xl" required />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label htmlFor="fim" className="text-xl font-medium text-[#545454] dark:text-white">Horário de Fim</label>
                        <input type="time" id="fim" name="horario_fim" className="w-full border border-[#e0e0e0] rounded-md py-2.5 px-2 text-xl" required />
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#002866] text-2xl cursor-pointer text-white font-semibold py-3 px-10 rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Criando...' : 'Criar em todos os setores'}
                    </button>
                </div>
            </form>
        </>
    );
}
