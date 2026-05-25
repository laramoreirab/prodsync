import { useState, useEffect } from 'react';
import { Loader2, Pencil, ChevronDown } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Badge } from '../../badge';
import { eventosCrudService } from '@/services/eventosCrudService';

const BADGE = {
    Setup: "rounded-xl px-3 text-amarelo font-semibold bg-[var(--amarelo-setup)]",
    Parada: "rounded-xl px-3 text-[var(--trash)] font-semibold bg-red-100",
};

export default function FormJustificativaEvento({ onFechar }) {
    const [evento, setEvento] = useState(null);
    const [motivos, setMotivos] = useState([]);
    const [motivo, setMotivo] = useState('');
    const [observacao, setObservacao] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false); // salvando → loadingSubmit

    useEffect(() => {
        async function carregar() {
            try {
                const [dataEvento, dataMotivos] = await Promise.all([
                    eventosCrudService.getEventoPendente(),
                    eventosCrudService.getMotivos()
                ]);
                setEvento(dataEvento);
                setMotivos(dataMotivos);
            } catch {
                toast.error('Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!motivo) return toast.error('Selecione um motivo principal.');

        setLoadingSubmit(true);
        try {
            await eventosCrudService.justificar({
                id_evento: evento.id_evento,
                id_maquina: evento.id_maquina,
                id_motivo_parada: Number(motivo),
                observacao
            });
            toast.success('Justificativa enviada com sucesso!');
            onFechar?.();
        } catch (error) {
            toast.error(error.message || 'Erro ao justificar evento');
        } finally {
            setLoadingSubmit(false);
        }
    }

    return (
        <>
            <div className="title_modal flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <Pencil className="mr-2 text-4xl text-white" />
                    <DialogTitle className="text-3xl text-white">Justificar Evento</DialogTitle>
                </div>
            </div>

            <Separator className="my-2" />

            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
                </div>
            ) : !evento ? (
                <div className="flex justify-center items-center py-16">
                    <p className="text-xl font-semibold text-gray-500">Nenhum evento pendente de justificativa encontrado.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="px-2 pb-8 pt-4 flex flex-col gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-black">Informações do Evento</h1>

                        <div className="flex flex-col w-full gap-2 mt-2 mb-6 cursor-not-allowed">
                            <div className="flex items-center">
                                <p className="text-xl font-semibold text-black mr-2">Evento:</p>
                                <Badge className={BADGE[evento.status_atual] ?? "rounded-xl px-3 font-semibold bg-gray-100"}>
                                    {evento.status_atual}
                                </Badge>
                            </div>
                            <div className="flex items-center">
                                <p className="text-xl font-semibold text-black mr-2">Máquina:</p>
                                <p className="text-xl font-medium text-[#7c7c81]">{evento.maquina?.nome ?? '—'}</p>
                            </div>
                            <div className="flex items-center">
                                <p className="text-xl font-semibold text-black mr-2">Data:</p>
                                <p className="text-xl font-medium text-[#7c7c81]">{evento.inicio_formatado ?? '—'}</p>
                            </div>
                            <div className="flex items-center">
                                <p className="text-xl font-semibold text-black mr-2">Duração:</p>
                                <p className="text-xl font-medium text-[#7c7c81]">{evento.duracao ?? 'Em andamento'}</p>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-black">Justificativa</h1>

                        <div className="space-y-3">
                            <div>
                                <span className="block text-xl font-semibold mb-1 mt-2">Motivo Principal:</span>
                                <div className="relative">
                                    <select
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                        className="w-full border shadow-sm border-gray-200 rounded-md p-2.5 pr-10 text-xl text-gray-500 outline-none bg-white appearance-none font-medium"
                                    >
                                        <option value="">Selecione o motivo</option>
                                        {motivos.map((m) => (
                                            <option key={m.id_motivo} value={m.id_motivo}>{m.descricao}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <span className="block text-xl font-semibold mb-1 mt-2">Observação:</span>
                                <textarea
                                    value={observacao}
                                    onChange={(e) => setObservacao(e.target.value)}
                                    placeholder="Escreva uma observação adicional..."
                                    rows="3"
                                    className="w-full border shadow-sm border-gray-200 font-medium rounded-md p-2.5 text-xl outline-none placeholder-gray-300 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center mt-4">
                            <button
                                type="submit"
                                disabled={loadingSubmit}
                                className="bg-[#002866] text-xl cursor-pointer text-white font-semibold py-3 px-10 rounded-lg disabled:opacity-60 flex items-center gap-2"
                            >
                                {loadingSubmit && <Loader2 className="w-5 h-5 animate-spin" />}
                                {loadingSubmit ? 'Enviando...' : 'Justificar'}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
}