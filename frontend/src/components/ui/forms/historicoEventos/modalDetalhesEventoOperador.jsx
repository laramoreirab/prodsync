import { useState, useEffect } from 'react';
import { ReceiptText } from "lucide-react";
import {
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { eventosCrudService } from '@/services/eventosCrudService';

const normalizarLista = (...valores) => {
    const valor = valores.find((item) => item !== undefined && item !== null && item !== "");
    if (!valor) return [];
    if (Array.isArray(valor)) return valor.filter(Boolean);
    return [valor];
};

const extrairLabelOP = (op) => {
    if (typeof op === "string" || typeof op === "number") return op;
    return op?.codigo_lote ?? op?.id_ordem ?? op?.id ?? op?.nome ?? "-";
};

export default function DetalhesEvento({ eventoId }) {
    const [tipoEvento, setTipoEvento] = useState('');
    const [opsSelecionadas, setOpsSelecionadas] = useState([]);
    const [nomeMotivo, setNomeMotivo] = useState('');
    const [observacao, setObservacao] = useState('');
    const [inicioData, setInicioData] = useState('');
    const [inicioHora, setInicioHora] = useState('');
    const [fimData, setFimData] = useState('');
    const [fimHora, setFimHora] = useState('');

    useEffect(() => {
        const buscarDados = async () => {
            try {
                const dados = await eventosCrudService.getById(eventoId);
                setTipoEvento(dados.status_maquina || dados.tipo || dados.ultimo_evento || '');
                setOpsSelecionadas(normalizarLista(
                    dados.ops_afetadas,
                    dados.op_afetada,
                    dados.ordens_afetadas,
                    dados.ordem_producao,
                    dados.op,
                ).map(extrairLabelOP));
                setNomeMotivo(
                    dados.motivo ||
                    dados.motivo_parada?.descricao ||
                    dados.motivo_parada?.nome ||
                    ''
                );
                setObservacao(dados.observacao || '');

                const extrairEFormatar = (dataOriginal) => {
                    if (!dataOriginal) return { data: '', hora: '' };
                    const [dataParte, horaParte] = String(dataOriginal).trim().split(/[T ]/);

                    let dataCerta = dataParte;
                    if (dataParte && dataParte.includes('-')) {
                        const [ano, mes, dia] = dataParte.split('-');
                        if (ano.length === 4) {
                            dataCerta = `${dia}/${mes}/${ano}`;
                        }
                    }

                    return {
                        data: dataCerta,
                        hora: horaParte ? horaParte.slice(0, 5) : ''
                    };
                };

                if (dados.inicio) {
                    const formatado = extrairEFormatar(dados.inicio);
                    setInicioData(formatado.data);
                    setInicioHora(formatado.hora);
                }
                if (dados.fim) {
                    const formatado = extrairEFormatar(dados.fim);
                    setFimData(formatado.data);
                    setFimHora(formatado.hora);
                }
            } catch (error) {
                toast.error("Erro ao carregar dados do evento.");
            }
        };

        if (eventoId) buscarDados();
    }, [eventoId]);

    return (
        <>
            <div className="flex items-center">
                <div className="text-secondary flex items-center px-4 py-2 rounded-md">
                    <ReceiptText strokeWidth={2.5} size={35} className="mr-2" />
                    <DialogTitle className="text-3xl font-semibold">
                        Detalhes do Evento
                    </DialogTitle>
                </div>
            </div>

            <Separator className="my-2" />

            <div className=" flex flex-col cursor-text">
                <div className="flex flex-col">
                    <div className="flex flex-col w-full gap-4 px-2 pb-8 pt-4 cursor-text">
                        <div className="flex items-center">
                            <p className="text-xl font-semibold text-black mr-1">Evento:</p>
                            <Badge variant={tipoEvento === 'Parada' ? 'parada' : tipoEvento === 'Setup' ? 'setup' : 'outline'}
                                className="px-3 text-lg" >
                                {tipoEvento}
                            </Badge>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <span className="text-xl font-semibold text-black">OP(s) Afetada(s):</span>
                            <ul className="flex flex-col">
                                {opsSelecionadas.length > 0 ? opsSelecionadas.map((op, index) => (
                                    <li key={index} className="text-[#333333] font-medium text-xl">
                                        - {op}
                                    </li>
                                )) : (
                                    <li className="text-[#333333] font-medium text-xl">
                                        - Nenhuma OP vinculada
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="text-xl font-semibold text-black">Data Início: </span>
                            <div className="flex">
                                <span className="text-xl text-[#333333]">
                                    {inicioData} às {inicioHora}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="text-xl font-semibold text-black">Data Fim:</span>
                            <span className="text-xl text-[#333333]">
                                {fimData && fimHora
                                    ? `${fimData} às ${fimHora}`
                                    : <span>Ativo</span>
                                }
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="text-xl font-semibold text-black">Motivo: </span>
                            <span className="text-xl font-medium text-[#333333]">
                                {nomeMotivo || <span className="text-xl font-medium text-[#333333]">Não justificado</span>}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-xl font-semibold text-black">Observação:</span>
                            {observacao ? (
                                <p className="text-[#333333] font-medium text-xl">
                                    {observacao}
                                </p>
                            ) : (
                                <span className="text-xl font-medium text-[#333333]">Sem observação</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
