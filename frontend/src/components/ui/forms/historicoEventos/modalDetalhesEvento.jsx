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

const formatarDataBR = (dataString) => {
    if (!dataString) return '';
    return dataString.split('-').reverse().join('/');
};

export default function DetalhesEvento({ eventoId }) {
    // const [loading, setLoading] = useState(true);
    const [dadosEvento, setDadosEvento] = useState(null)

    const [tipoEvento, setTipoEvento] = useState('');
    const [maquinasSelecionadas, setMaquinasSelecionadas] = useState([]);
    const [setoresSelecionados, setSetoresSelecionados] = useState([]);
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
                setMaquinasSelecionadas(dados.maquina ? [dados.maquina] : []);
                setSetoresSelecionados(dados.setor_afetado ? [dados.setor_afetado] : []);
                setOpsSelecionadas(dados.op_afetada ? [dados.op_afetada] : []);
                setIdMotivoPrincipal(dados.id_motivo_parada || '');
                setObservacao(dados.observacao || '');
                setDadosEvento(dados);
                if (dados.inicio) {
                    setInicioData(dados.inicio.split('T')[0]);
                    setInicioHora(dados.inicio.split('T')[1]?.slice(0, 5) || '');
                }
                if (dados.fim) {
                    setFimData(dados.fim.split('T')[0]);
                    setFimHora(dados.fim.split('T')[1]?.slice(0, 5) || '');
                }
            } catch (error) {
                toast.error("Erro ao carregar dados do evento.");
            }
        };

        if (eventoId) buscarDados();
    }, [eventoId]);

    // helpers de exibição
    const nomeMotivo = OPCOES_MOTIVO.find(m => m.value === Number(idMotivoPrincipal))?.label;

    const diaFormatado = formatarDataBR(inicioData);
    const fimDataFormatada = formatarDataBR(fimData);

    return (
        <>
            <div className="flex items-center">
                <div className="bg-blue-900 flex items-center px-4 py-2 rounded-md">
                    <ReceiptText className="mr-2 text-4xl text-white" />
                    <DialogTitle className="text-3xl text-white">
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

                        {/* Setor */}
                        <div className="flex items-center">
                            <span className="text-xl font-semibold text-black">Setor:</span>
                            <div className="flex">
                                {setoresSelecionados.map(setor => (
                                    <span key={setor} className="text-[#333333] font-medium px-1 text-xl">
                                        {setor}
                                    </span>
                                ))}
                            </div>
                        </div>


                        {/* Máquinas */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xl font-semibold text-black">Máquina(s) Afetada(s): </span>

                            <div className="flex flex-wrap gap-2">
                                {maquinasSelecionadas.map((maquina, index) => (
                                    <span key={index} className="bg-[#F2F2F2] text-[#333333] mt-1.5 font-medium px-3 py-1.5 rounded-md flex items-center gap-2 text-[15px]">
                                        {maquina}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Ordens de Produção */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xl font-semibold text-black">OP(s) Afetada(s):</span>
                            <div className="flex flex-wrap gap-2">
                                {opsSelecionadas.map((op, index) => (
                                    <span key={index} className="bg-[#F2F2F2] text-[#333333] mt-1.5 font-medium px-3 py-1.5 rounded-md flex items-center gap-2 text-[15px]">
                                        {op}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Início */}
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-semibold text-black">Data Início: </span>
                            <div className="flex">
                                <span className="text-[#333333] font-medium text-xl">
                                    {diaFormatado} às {inicioHora}
                                </span>
                            </div>
                        </div>

                        {/* Fim */}
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-semibold text-black">Data Fim:</span>
                            <span className="text-[#333333] font-medium text-xl">
                                {fimData && fimHora
                                    ? `${fimDataFormatada} às ${fimHora}`
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