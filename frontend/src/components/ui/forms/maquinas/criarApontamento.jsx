import { useState, useEffect } from 'react';
import { Loader2, ChevronDown, Plus, Calendar } from "lucide-react";
import {
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { deduplicarTurnosParaSelect } from "@/lib/filterUtils";

export default function FormCriarApontamento({ id_maquina, id_ordemProducao, onSuccess }) {
    const [loading, setLoading] = useState(false);

    const [ordens, setOrdens] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [loadingOrdens, setLoadingOrdens] = useState(false);
    const [loadingTurnos, setLoadingTurnos] = useState(false);

    const [form, setForm] = useState({
        id_ordemProducao: id_ordemProducao || '',
        id_maquina: id_maquina || '',
        id_turno: '',
        qtd_boa: '',
        qtd_refugo: '',
        inicio: '',
        fim: '',
        observacao: '',
    });

    useEffect(() => {
        if (id_ordemProducao) {
            setForm((prev) => ({ ...prev, id_ordemProducao: String(id_ordemProducao) }));
        }
    }, [id_ordemProducao]);

    useEffect(() => {
        if (id_maquina) {
            setForm((prev) => ({ ...prev, id_maquina: String(id_maquina) }));
        }
    }, [id_maquina]);

    useEffect(() => {
        async function fetchOrdens() {
            setLoadingOrdens(true);
            try {
                const data = await apiFetch('/api/ordens?pagina=1&limite=100');
                if (data.sucesso !== false) setOrdens(data.dados || []);
            } catch {
                toast.error('Erro ao carregar ordens de produção');
            } finally {
                setLoadingOrdens(false);
            }
        }

        async function fetchTurnos() {
            setLoadingTurnos(true);
            try {
                const data = await apiFetch('/api/turnos/listarTurnos');
                if (data.sucesso !== false) {
                    setTurnos(deduplicarTurnosParaSelect(data.dados || []));
                }
            } catch {
                toast.error('Erro ao carregar turnos');
            } finally {
                setLoadingTurnos(false);
            }
        }

        fetchOrdens();
        fetchTurnos();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...form,
                id_maquina: Number(form.id_maquina),
                id_ordemProducao: Number(form.id_ordemProducao),
                id_turno: Number(form.id_turno),
                qtd_boa: form.qtd_boa === '' ? '' : Number(form.qtd_boa),
                qtd_refugo: form.qtd_refugo === '' ? '' : Number(form.qtd_refugo),
                inicio: form.inicio ? new Date(form.inicio).toISOString() : '',
                fim: form.fim ? new Date(form.fim).toISOString() : '',
            };

            const data = await apiFetch('/api/apontamentos', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (!data.sucesso) {
                toast.error(data.mensagem || data.erro || 'Erro ao criar apontamento');
                return;
            }

            toast.success(data.mensagem || 'Apontamento criado com sucesso!');
            onSuccess?.();

            setForm({
                id_ordemProducao: id_ordemProducao ? String(id_ordemProducao) : '',
                id_maquina: id_maquina ? String(id_maquina) : '',
                id_turno: '',
                qtd_boa: '',
                qtd_refugo: '',
                inicio: '',
                fim: '',
                observacao: '',
            });

        } catch {
            toast.error('Erro de conexão com o servidor');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="title_modal flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Plus className="mr-2 text-4xl text-white" />
                    <DialogTitle className="text-3xl text-white">
                        Criar Apontamento
                    </DialogTitle>
                </div>
            </div>
            <Separator className="my-2" />

            <form onSubmit={handleSubmit} className="space-y-6 p-4">

                <div className="w-full">
                    <label className="block text-lg font-semibold mb-1">
                        Ordem de Produção
                    </label>
                    <div className="relative">
                        <select
                            name="id_ordemProducao"
                            value={form.id_ordemProducao}
                            onChange={handleChange}
                            disabled={loadingOrdens || !!id_ordemProducao}
                            className="w-full h-11 border outline-none border-neutral-200 shadow-sm rounded-lg bg-white p-2.5 text-lg appearance-none pr-10 text-gray-700 font-medium disabled:opacity-50"
                        >
                            <option value="" disabled>
                                {loadingOrdens ? 'Carregando...' : 'Selecione a Ordem'}
                            </option>
                            {ordens.map(op => (
                                <option key={op.id ?? op.id_ordem} value={op.id ?? op.id_ordem}>
                                    {op.codigo_lote || op.nome || `Ordem #${op.id ?? op.id_ordem}`}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                </div>

                <div className="w-full">
                    <label className="block text-lg font-semibold mb-1">
                        Turno
                    </label>
                    <div className="relative">
                        <select
                            name="id_turno"
                            value={form.id_turno}
                            onChange={handleChange}
                            disabled={loadingTurnos}
                            className="w-full h-11 border outline-none border-neutral-200 shadow-sm rounded-lg bg-white p-2.5 text-lg appearance-none text-gray-700 pr-10 font-medium disabled:opacity-50"
                        >
                            <option value="" disabled>
                                {loadingTurnos ? 'Carregando...' : 'Selecione o Turno'}
                            </option>
                            {turnos.map(t => (
                                <option key={t.id_turno} value={t.id_turno}>
                                    {t.nome_turno || `Turno #${t.id_turno}`}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <label className="block text-lg font-semibold mb-1">
                            Início da Produção
                        </label>
                        <div className="relative">
                            <input
                                type="datetime-local"
                                name="inicio"
                                value={form.inicio}
                                onChange={handleChange}
                                className="w-full h-11 shadow-sm outline-none border border-neutral-200 rounded-lg bg-white p-2.5 text-lg text-gray-700 pr-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden font-medium"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="block text-lg font-semibold mb-1">
                            Final da Produção
                        </label>
                        <div className="relative">
                            <input
                                type="datetime-local"
                                name="fim"
                                value={form.fim}
                                onChange={handleChange}
                                className="w-full h-11 shadow-sm outline-none border border-neutral-200 rounded-lg bg-white p-2.5 text-lg text-gray-700 pr-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden font-medium"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                        <label className="block text-lg font-semibold mb-1">
                            Peças Produzidas
                        </label>
                        <input
                            type="number"
                            name="qtd_boa"
                            value={form.qtd_boa}
                            onChange={handleChange}
                            min={0}
                            placeholder="Digite o total de peças"
                            className="input-no-spinner w-full h-11 shadow-sm outline-none border placeholder:font-medium placeholder-gray-300 border-neutral-200 rounded-lg bg-white p-2.5 text-lg"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-lg font-semibold mb-1">
                            Peças de Refugo
                        </label>
                        <input
                            type="number"
                            name="qtd_refugo"
                            value={form.qtd_refugo}
                            onChange={handleChange}
                            min={0}
                            placeholder="Digite a quantidade de refugo"
                            className="input-no-spinner w-full h-11 border shadow-sm placeholder:font-medium placeholder-gray-300 outline-none border-neutral-200 rounded-lg bg-white p-2.5 text-lg"
                        />
                    </div>
                </div>

                <div className="w-full mb-4">
                    <label className="block text-lg font-semibold mb-1">
                        Observação
                    </label>
                    <textarea
                        name="observacao"
                        value={form.observacao}
                        onChange={handleChange}
                        placeholder="Escreva uma observação adicional..."
                        rows="3"
                        className="w-full border shadow-sm border-gray-200 font-medium rounded-md p-2.5 text-lg outline-none placeholder-gray-300 resize-none"
                    />
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#002866] text-xl cursor-pointer text-white font-semibold py-3 px-10 rounded-lg flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? 'Criando...' : 'Criar'}
                    </button>
                </div>
            </form>
        </>
    );
}
