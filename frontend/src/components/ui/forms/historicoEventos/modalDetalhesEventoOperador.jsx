import { useState, useEffect } from 'react';
import { Loader2, ReceiptText } from "lucide-react";
import {
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { eventosCrudService } from '@/services/eventosCrudService';

const OPCOES_MOTIVO = [
    { label: "Falta de Energia", value: 1 },
    { label: "Manutenção Preventiva", value: 2 },
    { label: "Manutenção Corretiva", value: 3 },
    { label: "Falta de Material", value: 4 },
    { label: "Outros", value: 5 },
];

export default function DetalhesEvento({ eventoId }) {
    const [dadosEvento, setDadosEvento] = useState(null)

    const [tipoEvento, setTipoEvento] = useState('');
    const [opsSelecionadas, setOpsSelecionadas] = useState([]);
    const [idMotivoPrincipal, setIdMotivoPrincipal] = useState([]);
    const [observacao, setObservacao] = useState('');
    const [inicioData, setInicioData] = useState('');
    const [inicioHora, setInicioHora] = useState('');
    const [fimData, setFimData] = useState('');
    const [fimHora, setFimHora] = useState('');

    // — mesmo useEffect do formEdicao —
    useEffect(() => {
        const buscarDados = async () => {
            try {
                const dados = await eventosCrudService.getById(eventoId);
                setTipoEvento(dados.status_maquina || '');
                setOpsSelecionadas(dados.op_afetada ? [dados.op_afetada] : []);
                setIdMotivoPrincipal(dados.id_motivo_parada || '');
                setObservacao(dados.observacao || '');
                setDadosEvento(dados);
               // Nova função interna blindada
                const extrairEFormatar = (dataOriginal) => {
                    if (!dataOriginal) return { data: '', hora: '' };
                    
                    // Separa a data da hora (aceita 'T' do padrão ISO ou espaço de SQL)
                    const [dataParte, horaParte] = String(dataOriginal).trim().split(/[T ]/);
                    
                    let dataCerta = dataParte;
                    // Se a data tem traço e começa com o ano (YYYY-MM-DD), inverte para DD/MM/YYYY
                    if (dataParte && dataParte.includes('-')) {
                        const [ano, mes, dia] = dataParte.split('-');
                        if (ano.length === 4) {
                            dataCerta = `${dia}/${mes}/${ano}`;
                        }
                    }

                    return {
                        data: dataCerta,
                        hora: horaParte ? horaParte.slice(0, 5) : '' // Pega apenas HH:MM
                    };
                };

                // Aplica a formatação ANTES de salvar no estado
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

    // helpers de exibição
    const nomeMotivo = OPCOES_MOTIVO.find(m => m.value === Number(idMotivoPrincipal))?.label;

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
                {/* Informações do Evento */}

                <div className="flex flex-col">


                    <div className="flex flex-col w-full gap-4 px-2 pb-8 pt-4 cursor-text">

                        {/* Status */}
                        <div className="flex items-center">
                            <p className="text-xl font-semibold text-black mr-1">Evento:</p>
                            <Badge variant={tipoEvento === 'Parada' ? 'parada' : tipoEvento === 'Setup' ? 'setup' : 'outline'}
                                className="px-3 text-lg" >
                                {tipoEvento}
                            </Badge>
                        </div>

                        {/* Ordens de Produção */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xl font-semibold text-black">OP(s) Afetada(s):</span>
                            <ul className="flex flex-col">
                                {opsSelecionadas.map((op, index) => (
                                    <li key={index} className="text-[#333333] font-medium text-xl">
                                        - {op}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Início */}
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-semibold text-black">Data Início: </span>
                            <div className="flex">
                                <span className="text-xl text-[#333333]">
                                    {inicioData} às {inicioHora}
                                </span>
                            </div>
                        </div>

                        {/* Fim */}
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-semibold text-black">Data Fim:</span>
                            <span className="text-xl text-[#333333]">
                                {fimData && fimHora
                                    ? `${fimData} às ${fimHora}`
                                    : <span>Ativo</span>
                                }
                            </span>
                        </div>

                        {/* Motivo */}
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-semibold text-black">Motivo: </span>
                            <span className="text-xl font-medium text-[#333333]">
                                {nomeMotivo || <span className="text-xl font-medium text-[#333333]">Não justificado</span>}
                            </span>
                        </div>

                        {/* Observação */}
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