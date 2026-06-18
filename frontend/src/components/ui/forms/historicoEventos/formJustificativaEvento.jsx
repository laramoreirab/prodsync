import { useState, useEffect } from 'react';
import { Loader2, Pencil, ChevronDown } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Badge } from '../../badge';
import { eventosCrudService } from '@/services/eventosCrudService';
import FormSelect from "@/components/ui/FormSelect";

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
        if (!evento?.id_evento && !evento?.id) return toast.error('Evento pendente inválido.');
        if (!motivo) return toast.error('Selecione um motivo principal.');

        setLoadingSubmit(true);
        try {
            await eventosCrudService.justificar({
                id_evento: evento.id_evento ?? evento.id,
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

    const tipoEvento = evento?.tipo ?? evento?.status_atual;
    const maquinaEvento = evento?.maquina_nome
        ?? (typeof evento?.maquina === 'object' ? evento.maquina?.nome : evento?.maquina);
    const dataEvento = evento?.inicio_formatado ?? evento?.data;

    return (
        <>
            <div className="title_modal flex items-center">
               <div className="text-secondary flex items-center px-4 py-2 rounded-md">
                    <Pencil strokeWidth={2.8} className="mr-2" size={30} />
                    <DialogTitle className="text-3xl font-semibold">Justificar Evento</DialogTitle>
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
                                <Badge className={BADGE[tipoEvento] ?? "rounded-xl px-3 font-semibold bg-gray-100"}>
                                    {tipoEvento ?? '—'}
                                </Badge>
                            </div>
                            <div className="flex items-center">
                                <p className="text-xl font-semibold text-black mr-2">Máquina:</p>
                                <p className="text-xl font-medium text-[#7c7c81]">{maquinaEvento ?? '-'}</p>
                            </div>
                            <div className="flex items-center">
                                <p className="text-xl font-semibold text-black mr-2">Data:</p>
                                <p className="text-xl font-medium text-[#7c7c81]">{dataEvento ?? '-'}</p>
                            </div>
                            <div className="flex items-center">
                                <p className="text-xl font-semibold text-black mr-2">Duração:</p>
                                <p className="text-xl font-medium text-[#7c7c81]">{evento.duracao ?? 'Em andamento'}</p>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-black">Justificativa</h1>

                        <div className="space-y-3">
                            <FormSelect
                                label="Motivo Principal:"
                                options={motivos}
                                value={motivo}
                                onValueChange={(val) => setMotivo(val)}
                                placeholder="Selecione o motivo"
                            />
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
                                className="cursor-pointer bg-[#002866] hover:bg-[#003891] hover:scale-105 transition-all text-xl text-white font-semibold py-3 px-10 rounded-lg disabled:opacity-60 flex items-center gap-2"
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
